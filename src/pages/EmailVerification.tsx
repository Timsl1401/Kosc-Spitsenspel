import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

const EmailVerification: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, resendVerificationCode } = useAuth();

  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 4) {
      setError('Voer alle 4 cijfers in');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await verifyEmail(verificationCode);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timeLeft > 0) return;
    
    setIsLoading(true);
    setError('');

    try {
      const result = await resendVerificationCode();
      if (result.success) {
        setTimeLeft(300); // Reset timer to 5 minutes
        setCode(['', '', '', '']);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email geverifieerd!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Je account is succesvol geactiveerd. Je wordt doorgestuurd naar de login pagina.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-black">
            <img 
              src="/kosc-logo.png" 
              alt="KOSC" 
              className="h-8 w-auto"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verificeer je email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We hebben een 4-cijferige verificatiecode gestuurd naar{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="verification-code" className="sr-only">
              Verificatiecode
            </label>
            <div className="flex justify-center space-x-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  name={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-kosc-green-500 focus:border-kosc-green-500"
                  placeholder="0"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center justify-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || code.join('').length !== 4}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-kosc-green-600 hover:bg-kosc-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kosc-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifiëren...' : 'Verificeer account'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={timeLeft > 0 || isLoading}
              className="text-sm text-kosc-green-600 hover:text-kosc-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {timeLeft > 0 
                ? `Nieuwe code versturen over ${formatTime(timeLeft)}`
                : 'Nieuwe code versturen'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;
