import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Check, Eye, Search, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { useGemStore } from '../stores/gemStore';
import { formatCurrency, formatDate } from '../lib/utils';
import { useAlert } from '../contexts/AlertContext';

const AdminDashboardPage = () => {
  const { user } = useAuthStore();
  const { getPendingGems, approveGem, rejectGem } = useGemStore();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [activeGemId, setActiveGemId] = useState<string | null>(null);
  
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }
  
  const pendingGems = getPendingGems();
  const filteredGems = pendingGems.filter(gem => 
    gem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gem.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gem.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleApproveGem = async (gemId: string) => {
    setIsApproving(true);
    setActiveGemId(gemId);
    
    try {
      await approveGem(gemId);
      showAlert('success', 'Gem approved successfully');
    } catch (error) {
      showAlert('error', 'Failed to approve gem');
    } finally {
      setIsApproving(false);
      setActiveGemId(null);
    }
  };
  
  const handleRejectGem = async (gemId: string) => {
    setIsRejecting(true);
    setActiveGemId(gemId);
    
    try {
      await rejectGem(gemId);
      showAlert('success', 'Gem rejected');
    } catch (error) {
      showAlert('error', 'Failed to reject gem');
    } finally {
      setIsRejecting(false);
      setActiveGemId(null);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display mb-2">Admin Dashboard</h1>
            <p className="text-neutral-600">
              Manage pending gem approvals and platform operations
            </p>
          </div>
          
          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search gems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full md:w-64"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-neutral-200 px-6 py-4">
            <h2 className="font-semibold">Pending Approvals ({pendingGems.length})</h2>
          </div>
          
          {filteredGems.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">No pending gems</h3>
              <p className="text-neutral-600 mb-6">
                All gems have been reviewed. Check back later for new submissions.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Gem
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {filteredGems.map((gem) => (
                    <tr key={gem.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                            <img src={gem.images[0]} alt={gem.title} className="h-full w-full object-cover" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900">{gem.title}</div>
                            <div className="text-sm text-neutral-500">{gem.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900">{gem.carat} carats, {gem.color}</div>
                        <div className="text-sm text-neutral-500">
                          Origin: {gem.origin}, Clarity: {gem.clarity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900">{gem.ownerName}</div>
                        <div className="text-sm text-primary-600 font-medium">{formatCurrency(gem.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {formatDate(gem.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/gems/${gem.id}`)}
                            leftIcon={<Eye className="h-4 w-4" />}
                          >
                            View
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApproveGem(gem.id)}
                            isLoading={isApproving && activeGemId === gem.id}
                            disabled={isApproving || isRejecting}
                            leftIcon={<Check className="h-4 w-4" />}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRejectGem(gem.id)}
                            isLoading={isRejecting && activeGemId === gem.id}
                            disabled={isApproving || isRejecting}
                            leftIcon={<X className="h-4 w-4" />}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Platform Stats</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Total Users</span>
                <span className="font-medium">187</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Active Gems</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Offers (Last 7 Days)</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Completed Sales</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Credit Usage</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Credits Issued</span>
                <span className="font-medium">2,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Credits Used</span>
                <span className="font-medium">1,875</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Credits Purchased</span>
                <span className="font-medium">1,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Revenue from Credits</span>
                <span className="font-medium">{formatCurrency(12000)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">System Alerts</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start p-3 bg-accent-50 text-accent-800 rounded-md">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">3 users with expired deposits</p>
                  <p className="text-sm">Action required within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-neutral-50 text-neutral-800 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                <div>
                  <p className="font-medium">Weekly report is ready</p>
                  <p className="text-sm">View marketplace analytics</p>
                </div>
              </div>
              <div className="flex items-start p-3 bg-success-50 text-success-800 rounded-md">
                <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">All systems operational</p>
                  <p className="text-sm">Last check: 15 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;