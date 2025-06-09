import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Diamond, Plus, Upload, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { useGemStore } from '../stores/gemStore';
import { useAlert } from '../contexts/AlertContext';
import { motion } from 'framer-motion';

const GEM_TYPES = [
  'Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Amethyst', 'Aquamarine', 
  'Citrine', 'Garnet', 'Opal', 'Pearl', 'Peridot', 'Tanzanite', 'Topaz', 'Turquoise'
];

const CLARITY_OPTIONS = [
  'FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'
];

const ORIGIN_OPTIONS = [
  'Afghanistan', 'Australia', 'Brazil', 'Cambodia', 'Canada', 'Colombia', 
  'India', 'Madagascar', 'Myanmar', 'Russia', 'South Africa', 'Sri Lanka', 
  'Tanzania', 'Thailand', 'USA', 'Zambia', 'Zimbabwe'
];

const PostGemPage = () => {
  const { user, updateCredits } = useAuthStore();
  const { addGem } = useGemStore();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    carat: '',
    color: '',
    clarity: '',
    origin: '',
    price: '',
  });
  
  const [images, setImages] = useState<string[]>([
    'https://images.pexels.com/photos/4939546/pexels-photo-4939546.jpeg',
    'https://images.pexels.com/photos/14751300/pexels-photo-14751300.jpeg'
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user || user.role !== 'gem-owner') {
    navigate('/');
    return null;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const addImageUrl = () => {
    const defaultImages = [
      'https://images.pexels.com/photos/9424865/pexels-photo-9424865.jpeg',
      'https://images.pexels.com/photos/15873393/pexels-photo-15873393.jpeg',
      'https://images.pexels.com/photos/985014/pexels-photo-985014.jpeg',
      'https://images.pexels.com/photos/995172/pexels-photo-995172.jpeg',
      'https://images.pexels.com/photos/4940760/pexels-photo-4940760.jpeg'
    ];
    
    // Use a random image from our defaults
    const unusedImages = defaultImages.filter(img => !images.includes(img));
    const randomImage = unusedImages[Math.floor(Math.random() * unusedImages.length)] || defaultImages[0];
    
    setImages((prev) => [...prev, randomImage]);
  };
  
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      showAlert('error', 'Please add at least one image');
      return;
    }
    
    if (user.credits < 1) {
      showAlert('error', 'You need at least 1 credit to post a gem');
      navigate('/buy-credits');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const gemId = await addGem({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        carat: Number(formData.carat),
        color: formData.color,
        clarity: formData.clarity,
        origin: formData.origin,
        images,
        price: Number(formData.price),
        ownerId: user.id,
        ownerName: user.name,
      });
      
      // Deduct 1 credit
      updateCredits(user.credits - 1);
      
      showAlert('success', 'Your gem has been submitted for approval');
      navigate(`/gems/${gemId}`);
    } catch (error) {
      showAlert('error', 'Failed to submit gem');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display mb-2">Post a Gem</h1>
          <p className="text-neutral-600">
            Share your precious gemstone with potential buyers. This will cost 1 credit.
            You currently have {user.credits} credits.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="label block mb-1">
                  Gem Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Premium Blue Sapphire"
                  className="input w-full"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="label block mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed information about your gem..."
                  className="textarea w-full h-32"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="label block mb-1">
                  Gem Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="select w-full"
                  required
                >
                  <option value="">Select Type</option>
                  {GEM_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="price" className="label block mb-1">
                  Price (USD)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 5000"
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="carat" className="label block mb-1">
                  Carat Weight
                </label>
                <input
                  id="carat"
                  name="carat"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.carat}
                  onChange={handleInputChange}
                  placeholder="e.g., 2.5"
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="color" className="label block mb-1">
                  Color
                </label>
                <input
                  id="color"
                  name="color"
                  type="text"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="e.g., Blue, Red, Green"
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="clarity" className="label block mb-1">
                  Clarity
                </label>
                <select
                  id="clarity"
                  name="clarity"
                  value={formData.clarity}
                  onChange={handleInputChange}
                  className="select w-full"
                  required
                >
                  <option value="">Select Clarity</option>
                  {CLARITY_OPTIONS.map((clarity) => (
                    <option key={clarity} value={clarity}>
                      {clarity}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="origin" className="label block mb-1">
                  Origin
                </label>
                <select
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  className="select w-full"
                  required
                >
                  <option value="">Select Origin</option>
                  {ORIGIN_OPTIONS.map((origin) => (
                    <option key={origin} value={origin}>
                      {origin}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="label block mb-1">
                  Images (minimum 1)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                  {images.map((url, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200"
                    >
                      <img
                        src={url}
                        alt={`Gem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                  
                  {images.length < 5 && (
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                    >
                      <Plus className="h-6 w-6 text-neutral-500 mb-1" />
                      <span className="text-sm text-neutral-500">Add Image</span>
                    </button>
                  )}
                </div>
                <p className="text-sm text-neutral-500">
                  Add up to 5 high-quality images of your gem. For the demo, we'll use sample images.
                </p>
              </div>
              
              <div className="md:col-span-2 border-t border-neutral-200 pt-6 mt-2">
                <div className="flex items-center p-4 bg-neutral-50 rounded-lg mb-6">
                  <Diamond className="h-6 w-6 text-primary-500 mr-3" />
                  <div>
                    <p className="font-medium">Posting Fee: 1 Credit</p>
                    <p className="text-sm text-neutral-500">
                      Your gem will be reviewed by an admin before being listed.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    leftIcon={<Upload className="h-4 w-4" />}
                  >
                    Submit Gem for Approval
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostGemPage;