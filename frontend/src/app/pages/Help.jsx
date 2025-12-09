import { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  Video,
  FileText,
  Users,
  Shield,
  CreditCard,
  Car,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData = [
    {
      id: 1,
      category: 'general',
      question: 'Comment créer un nouveau devis d\'assurance ?',
      answer: 'Pour créer un nouveau devis, allez dans la section "Mes Devis" de votre tableau de bord et cliquez sur "Nouveau Devis". Remplissez les informations requises sur le véhicule et les options de couverture, puis soumettez le formulaire.'
    },
    {
      id: 2,
      category: 'general',
      question: 'What documents do I need to provide?',
      answer: 'You will need to provide your driver\'s license, vehicle registration, and any previous insurance documents. Additional documents may be required depending on your specific situation.'
    },
    {
      id: 3,
      category: 'payments',
      question: 'How can I pay my insurance premium?',
      answer: 'You can pay your premium online using a credit card, bank transfer, or through our mobile payment options. We also accept cash payments at our office locations.'
    },
    {
      id: 4,
      category: 'claims',
      question: 'How do I file a claim?',
      answer: 'To file a claim, go to the Claims section and click "New Claim". Provide details about the incident, upload any relevant photos or documents, and submit the claim for review.'
    },
    {
      id: 5,
      category: 'technical',
      question: 'I can\'t log into my account. What should I do?',
      answer: 'If you\'re having trouble logging in, try resetting your password using the "Forgot Password" link. If the problem persists, contact our technical support team.'
    },
    {
      id: 6,
      category: 'policies',
      question: 'How do I update my policy information?',
      answer: 'You can update your policy information by going to the Policies section, selecting your policy, and clicking "Edit". Changes will be reviewed and applied within 24 hours.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'general', name: 'General', icon: HelpCircle },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'claims', name: 'Claims', icon: AlertTriangle },
    { id: 'policies', name: 'Policies', icon: Shield },
    { id: 'technical', name: 'Technical', icon: Car }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      contact: '+212 5 22 12 34 56',
      hours: 'Mon-Fri: 8AM-6PM',
      color: 'bg-green-500'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      contact: 'support@assuronline.ma',
      hours: '24/7',
      color: 'bg-blue-500'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      contact: 'Available now',
      hours: 'Mon-Fri: 9AM-5PM',
      color: 'bg-purple-500'
    }
  ];

  const quickLinks = [
    {
      title: 'User Guide',
      description: 'Complete guide to using our platform',
      icon: BookOpen,
      link: '#'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: Video,
      link: '#'
    },
    {
      title: 'Policy Documents',
      description: 'Download your policy documents',
      icon: FileText,
      link: '#'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: Users,
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Help & Support
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find answers to your questions, get help with your account, and connect with our support team
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4 text-center">
              How can we help you?
            </h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-lg"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                Frequently Asked Questions
              </h2>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {category.name}
                    </button>
                  );
                })}
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFAQs.map(faq => (
                  <div
                    key={faq.id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {faq.question}
                      </span>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-4">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No FAQs found matching your search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact & Quick Links */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Contact Support
              </h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={index}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg ${method.color} mr-3`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 dark:text-slate-100">
                            {method.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {method.description}
                          </p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {method.contact}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {method.hours}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Quick Links
              </h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.link}
                      className="flex items-center p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                    >
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                        <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {link.title}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {link.description}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300">Website</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300">API</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300">Payments</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
