import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const Purchase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Purchase Successful!</h1>
            <p className="text-muted-foreground mb-4">
              Thank you for your order
            </p>
            {orderId && (
              <div className="bg-muted p-4 rounded-lg mb-6">
                <p className="text-sm font-medium mb-1">Order ID</p>
                <p className="font-mono text-sm">{orderId}</p>
              </div>
            )}
            <div className="space-y-2">
              <Button className="w-full" onClick={() => navigate('/')}>
                Continue Shopping
              </Button>
              <p className="text-sm text-muted-foreground">
                Check out the updated recommendations on the home page!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Purchase;
