import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Edit, Settings, Shield, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { useOfferStore } from '../stores/offerStore';
import { useGemStore } from '../stores/gemStore';
import { formatCurrency, formatDate } from '../lib/utils';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const { offers } = useOfferStore();
  const { gems } = useGemStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'gems' | 'offers' | 'credits'>('profile');
  
  if (!user) {
    return null; // This should be handled by the PrivateRoute component
  }
  
  const userGems = gems.filter((gem) => gem.ownerId === user.id);
  
  const userOffers = user.role === 'gem-owner'
    ? offers.filter((offer) => offer.ownerId === user.id)
    : offers.filter((offer) => offer.buyerId === user.id);
  
  const acceptedOffers = userOffers.filter((offer) => offer.status === 'accepted');
  const pendingOffers = userOffers.filter((offer) => offer.status === 'pending');
  const counterOffers = userOffers.filter((offer) => offer.status === 'countered');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-primary-600 px-6 py-12 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mr-6">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">{user.name}</h1>
                  <p className="text-primary-100">{user.email}</p>
                  <div className="flex items-center mt-1">
                    <Shield className="w-4 h-4 mr-1" />
                    <span className="text-sm capitalize">{user.role.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <div className="bg-white/10 px-4 py-2 rounded-lg mb-2">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    <span className="text-xl font-semibold">{user.credits} Credits</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link to="/buy-credits">
                    <Button variant="accent" size="sm">
                      Buy Credits
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" leftIcon={<Settings className="w-4 h-4" />}>
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-b border-neutral-200">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Profile
              </button>
              {user.role === 'gem-owner' && (
                <button
                  onClick={() => setActiveTab('gems')}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'gems'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  My Gems
                </button>
              )}
              <button
                onClick={() => setActiveTab('offers')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'offers'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {user.role === 'gem-owner' ? 'Received Offers' : 'My Offers'}
              </button>
              <button
                onClick={() => setActiveTab('credits')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'credits'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Credit History
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Full Name</h3>
                      <p>{user.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Email</h3>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Role</h3>
                      <p className="capitalize">{user.role.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Member Since</h3>
                      <p>{formatDate(user.joinedAt)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Credits</h3>
                      <p>{user.credits} credits</p>
                    </div>
                    {user.role === 'gem-owner' && (
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">Gems Listed</h3>
                        <p>{userGems.length} gems</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button leftIcon={<Edit className="w-4 h-4" />}>
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'gems' && user.role === 'gem-owner' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Gems</h2>
                  <Link to="/post-gem">
                    <Button>Post New Gem</Button>
                  </Link>
                </div>
                
                {userGems.length === 0 ? (
                  <div className="text-center py-12 bg-neutral-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">No gems listed yet</h3>
                    <p className="text-neutral-500 mb-4">
                      Start selling your gems by creating your first listing.
                    </p>
                    <Link to="/post-gem">
                      <Button>Post a Gem</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userGems.map((gem) => (
                      <motion.div
                        key={gem.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-square relative">
                          <img
                            src={gem.images[0]}
                            alt={gem.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`badge ${
                              gem.isApproved
                                ? 'bg-success-100 text-success-800'
                                : 'bg-neutral-100 text-neutral-800'
                            }`}>
                              {gem.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{gem.title}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-primary-600 font-medium">
                              {formatCurrency(gem.price)}
                            </span>
                            <Link to={`/gems/${gem.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'offers' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">
                  {user.role === 'gem-owner' ? 'Received Offers' : 'My Offers'}
                </h2>
                
                <div className="space-y-8">
                  {acceptedOffers.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <span className="w-2 h-2 bg-success-500 rounded-full mr-2"></span>
                        Accepted Offers
                      </h3>
                      <div className="space-y-4">
                        {acceptedOffers.map((offer) => {
                          const gem = gems.find((g) => g.id === offer.gemId);
                          if (!gem) return null;
                          
                          return (
                            <div
                              key={offer.id}
                              className="border border-neutral-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center"
                            >
                              <div className="flex items-center mb-4 md:mb-0 md:flex-1">
                                <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                                  <img
                                    src={gem.images[0]}
                                    alt={gem.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium">{gem.title}</h4>
                                  <p className="text-sm text-neutral-500">
                                    {formatDate(offer.updatedAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="md:w-32 font-medium text-success-600">
                                {formatCurrency(offer.amount)}
                              </div>
                              <div className="mt-4 md:mt-0 md:ml-4">
                                <Link to={`/gems/${gem.id}`}>
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {pendingOffers.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <span className="w-2 h-2 bg-neutral-500 rounded-full mr-2"></span>
                        Pending Offers
                      </h3>
                      <div className="space-y-4">
                        {pendingOffers.map((offer) => {
                          const gem = gems.find((g) => g.id === offer.gemId);
                          if (!gem) return null;
                          
                          return (
                            <div
                              key={offer.id}
                              className="border border-neutral-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center"
                            >
                              <div className="flex items-center mb-4 md:mb-0 md:flex-1">
                                <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                                  <img
                                    src={gem.images[0]}
                                    alt={gem.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium">{gem.title}</h4>
                                  <p className="text-sm text-neutral-500">
                                    {formatDate(offer.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="md:w-32 font-medium">
                                {formatCurrency(offer.amount)}
                              </div>
                              <div className="mt-4 md:mt-0 md:ml-4">
                                <Link to="/offers">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {counterOffers.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                        Counter Offers
                      </h3>
                      <div className="space-y-4">
                        {counterOffers.map((offer) => {
                          const gem = gems.find((g) => g.id === offer.gemId);
                          if (!gem) return null;
                          
                          return (
                            <div
                              key={offer.id}
                              className="border border-neutral-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center"
                            >
                              <div className="flex items-center mb-4 md:mb-0 md:flex-1">
                                <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                                  <img
                                    src={gem.images[0]}
                                    alt={gem.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium">{gem.title}</h4>
                                  <p className="text-sm text-neutral-500">
                                    {formatDate(offer.updatedAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="md:w-32 font-medium text-accent-600">
                                {formatCurrency(offer.amount)}
                              </div>
                              <div className="mt-4 md:mt-0 md:ml-4">
                                <Link to="/offers">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {userOffers.length === 0 && (
                    <div className="text-center py-12 bg-neutral-50 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">No offers yet</h3>
                      <p className="text-neutral-500 mb-4">
                        {user.role === 'gem-owner'
                          ? "You haven't received any offers on your gems yet."
                          : "You haven't made any offers on gems yet."}
                      </p>
                      <Link to="/">
                        <Button>
                          {user.role === 'gem-owner' ? 'Post a Gem' : 'Browse Gems'}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'credits' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Credit History</h2>
                  <Link to="/buy-credits">
                    <Button>Buy Credits</Button>
                  </Link>
                </div>
                
                <div className="bg-primary-50 border border-primary-100 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Current Balance</h3>
                    <span className="text-2xl font-semibold text-primary-600">
                      {user.credits} Credits
                    </span>
                  </div>
                  <p className="text-neutral-600">
                    You receive 10 free credits every week. Additional credits can be purchased.
                  </p>
                </div>
                
                <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
                
                <div className="overflow-hidden rounded-lg border border-neutral-200">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Credits
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {formatDate(new Date().toISOString())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                          Weekly Free Credits
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-success-600 font-medium">
                          +10
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {formatDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                          {user.role === 'gem-owner' ? 'Posted Gem' : 'Made Offer'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-error-600 font-medium">
                          -1
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {formatDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                          Credit Purchase
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-success-600 font-medium">
                          +10
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                          Weekly Free Credits
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-success-600 font-medium">
                          +10
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;