
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { UserCog, ShieldCheck } from 'lucide-react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      setIsAdmin(profile?.role === 'admin');
      setLoading(false);
    };
    
    checkUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/ed6dc4fc-70bd-4ee0-aa8e-01c89f7c45f3.png" 
                alt="M25 Logo" 
                className="h-8 w-auto"
              />
              <Link to="/dashboard" className="text-xl font-bold">Club M25 Summit</Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link 
                  to="/admin"
                  className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900"
                >
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  Admin
                </Link>
              )}
              <Link 
                to="/profile/edit"
                className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900"
              >
                <UserCog className="h-4 w-4 mr-1" />
                Edit Profile
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
