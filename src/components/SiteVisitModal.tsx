import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Phone, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Property } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface SiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property;
}

const SiteVisitModal = forwardRef<HTMLDivElement, SiteVisitModalProps>(({ isOpen, onClose, property }, ref) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addSiteVisit, properties } = useApp();
  const [selectedPropertyId, setSelectedPropertyId] = useState(property?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim() || !date || !selectedPropertyId) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    addSiteVisit({
      name,
      phone,
      date: new Date(date),
      propertyId: selectedPropertyId,
    });

    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setPhone('');
      setDate('');
      onClose();
      
      toast({
        title: 'Site Visit Booked!',
        description: 'We will contact you shortly to confirm your visit.',
      });
    }, 2000);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setDate('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-card border border-border rounded-t-3xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  Visit Booked!
                </h3>
                <p className="text-muted-foreground text-center">
                  We'll contact you shortly to confirm
                </p>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-display font-semibold text-foreground">
                    Book Site Visit
                  </h3>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Select Property</label>
                    <select
                      value={selectedPropertyId}
                      onChange={(e) => setSelectedPropertyId(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                    >
                      <option value="">Choose a property</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} - {p.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-12 h-12"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-12 h-12"
                    />
                  </div>

                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="pl-12 h-12"
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-base font-semibold">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Visit
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SiteVisitModal.displayName = 'SiteVisitModal';

export default SiteVisitModal;
