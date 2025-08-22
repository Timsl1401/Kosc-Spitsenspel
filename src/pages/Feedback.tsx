import React, { useState } from 'react';
import { Send, MessageSquare, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Feedback: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.first_name || user?.email || '',
    email: user?.email || '',
    subject: '',
    message: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send feedback via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-feedback', {
        body: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          rating: formData.rating
        }
      });

      if (error) throw error;
      
      setSubmitStatus('success');
      setFormData({
        name: user?.user_metadata?.first_name || user?.email || '',
        email: user?.email || '',
        subject: '',
        message: '',
        rating: 5
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="kosc-section text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <MessageSquare className="h-12 w-12 text-green-500 mr-3" />
          <h1 className="kosc-title text-4xl">Feedback</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Heb je suggesties, vragen of opmerkingen over het KOSC Spitsenspel? 
          We horen graag van je!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="kosc-card">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Informatie</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-gray-600">spitsenspelkosc@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Website</p>
                <p className="text-gray-600">www.kosc.nl</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Waarom feedback?</h3>
            <p className="text-green-700 text-sm">
              Jouw feedback helpt ons om het KOSC Spitsenspel te verbeteren. 
              We waarderen elke suggestie en opmerking!
            </p>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="kosc-card">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Stuur Feedback</h2>
          
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Bedankt voor je feedback! We nemen contact met je op.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Er is een fout opgetreden. Probeer het opnieuw of neem contact op via email.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Naam *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Jouw naam"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="jouw@email.nl"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Onderwerp *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Bijv. Bug melding, Suggestie, Vraag"
              />
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                Beoordeling
              </label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="5">⭐⭐⭐⭐⭐ Uitstekend</option>
                <option value="4">⭐⭐⭐⭐ Zeer goed</option>
                <option value="3">⭐⭐⭐ Goed</option>
                <option value="2">⭐⭐ Redelijk</option>
                <option value="1">⭐ Slecht</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Bericht *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Beschrijf je feedback, suggestie of vraag..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full kosc-button flex items-center justify-center py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Versturen...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Verstuur Feedback
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
