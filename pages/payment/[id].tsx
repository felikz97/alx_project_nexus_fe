import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const PAYMENT_METHODS = [
  {
    name: 'PayPal',
    route: 'paypal',
    color: 'bg-blue-600',
    image: '/assets/payments/paypal_logo.png',
  },
  {
    name: 'M-Pesa',
    route: 'mpesa',
    color: 'bg-green-600',
    image: '/assets/payments/m-pesa-logo.png',
  },
  {
    name: 'Visa Card',
    route: 'vcard',
    color: 'bg-gray-800',
    image: '/assets/payments/Visa_logo.png',
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;

  return (
    <div className="max-w-xl mx-auto p-6">
    <button
        onClick={() => window.history.back()}
        className="text-green-800 hover:bg-yellow-200 mb-2 bg-yellow-100"
      >
        ← Move Back
      </button>
      <h1 className="text-2xl font-bold text-green-800 mb-6">
        💳 Choose Payment Method
      </h1>
      <div className='text-red-400'>
        <h3>
        Current available payment method is Paybal. Other methods are coming soon
        </h3>
      </div>
      <div className="space-y-4">
        {PAYMENT_METHODS.map((method) => (
          <Link
            key={method.name}
            href={`/payment/${id}/${method.route}`}
            className="block"
          >
            <div
              className={`flex items-center gap-4 px-4 py-3 rounded shadow text-white ${method.color} hover:opacity-90`}
            >
              <div className="w-12 h-12 relative">
                <Image
                  src={method.image}
                  alt={method.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <span className="text-lg font-semibold">{method.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
