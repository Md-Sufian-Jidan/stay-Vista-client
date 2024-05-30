import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import './CheckOutFrom.css'
import PropTypes from 'prop-types'
import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { ImSpinner9 } from "react-icons/im";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CheckOutForm = ({ closeModal, bookingInfo, refetch }) => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();
    // custom state
    const [clientSecret, setClientSecret] = useState('');
    // const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState(false);

    // stripe hooks
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        //fetch secret
        if (bookingInfo?.price && bookingInfo?.price > 0) {
            getClientSecret({ price: bookingInfo?.price });
        }
    }, [bookingInfo?.price]);

    // get client secret 
    const getClientSecret = async (price) => {
        // remember to get the price
        const { data } = await axiosSecure.post('/create-payment-intent', price);
        setClientSecret(data.client_secret);
        // console.log('client secret from', data);
        return data
    }

    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();
        // start disable button
        setProcessing(true);
        // step-01
        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }
        // step-02
        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);
        // step-03
        if (card == null) {
            return;
        }
        // step-04
        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });
        // step-05
        if (error) {
            console.log('[error]', error);
            setCardError(error.message);
            setProcessing(false)
            return;
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            setCardError('');
        }
        // step-06 confirm payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email,
                    name: user?.displayName,
                },
            },
        });
        if (confirmError) {
            console.log(confirmError);
            setProcessing(false);
            setCardError(confirmError.message);
            return;
        }
        if (paymentIntent.status === 'succeeded') {
            console.log(paymentIntent);
            // 1. create payment info object
            const paymentInfo = {
                ...bookingInfo,
                roomId: bookingInfo._id,
                transactionId: paymentIntent?.id,
                date: new Date(),
            };
            // remember this it will help you in the future
            delete paymentInfo?._id
            try {
                // 2. save payment info in booking in db
                const { data } = await axiosSecure.post('/booking', paymentInfo)

                // 3. change room status to booked in db
                await axiosSecure.patch(`/room/status/${bookingInfo?._id}`, { status: true })

                //update ui
                refetch();
                closeModal();
                toast.success(`Room Booked Successfully`);
                navigate('/dashboard/my-bookings');

                console.log(data);
            } catch (err) {
                console.log('save a room booked details', err);
            }

            console.log(paymentInfo);
            setProcessing(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                <div className='flex mt-2 justify-around'>
                    <button
                        type="submit" disabled={!stripe || !clientSecret || processing}
                        className='inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'
                    // onClick={closeModal}
                    >
                        {
                            processing ?
                                <ImSpinner9 className="animate-spin m-auto" size={24} /> :
                                (`Pay $${bookingInfo?.price}`)
                        }
                    </button>
                    <button
                        onClick={() => {
                            // handleDelete(id);
                            closeModal();
                        }}
                        type='button'
                        className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                    >
                        Cancel
                    </button>
                </div>
            </form>
            {cardError && <p className="text-red-500">{cardError}</p>}
        </>
    );
};

CheckOutForm.propTypes = {
    closeModal: PropTypes.bool,
    bookingInfo: PropTypes.object,
    refetch: PropTypes.func,
}
export default CheckOutForm;