import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy,
  CheckCircle,
  AlertTriangle,
  Globe,
  Repeat,
  Target,
  BarChart3,
  Settings,
  Zap
} from 'lucide-react';

const ContentScheduler = ({ onScheduleComplete, userProfile }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduledContent, setScheduledContent] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [calendarView, setCalendarView] = useState('month'); // month, week, day
  const [contentTemplates, setContentTemplates] = useState([]);
  const [publishingGoals, setPublishingGoals] = useState({
    weekly: 3,
    monthly: 12,
    platforms: ['wordpress', 'medium', 'linkedin']
  });

  useEffect(() => {
    loadScheduledContent();
    loadContentTemplates();
  }, []);

  const loadScheduledContent = async () => {
    // Mock scheduled content - would be real API call
    const mockScheduled = [
      {
        id: 'sched-1',
        title: 'SEO Best Practices Guide',
        date: '2025-06-15',
        time: '09:00',
        platforms: ['wordpress', 'medium'],
        status: 'scheduled',
        type: 'blog-post',
        author: 'John Doe',
        estimatedReadTime: '8 min',
        tags: ['SEO', 'Marketing', 'Guide']
      },
      {
        id: 'sched-2',
        title: 'Content Marketing Trends 2025',
        date: '2025-06-16',
        time: '14:30',
        platforms: ['linkedin', 'medium'],
        status: 'scheduled',
        type: 'article',
        author: 'Jane Smith',
        estimatedReadTime: '12 min',
        tags: ['Content Marketing', 'Trends', '2025']
      }
    ];
    setScheduledContent(mockScheduled);
  };

  const loadContentTemplates = async () => {
    // Mock content templates
    const templates = [
      {
        id: 'temp-1',
        name: 'Weekly Industry Update',
        type: 'blog-post',
        frequency: 'weekly',
        platforms: ['wordpress', 'linkedin'],
        tags: ['Industry News', 'Updates'],
        estimatedTime: '6 min'
      }
    ];
    setContentTemplates(templates);
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      wordpress: '📝',
      medium: '📰',
      linkedin: '💼',
      ghost: '👻',
      webflow: '🎨',
      shopify: '🛍️'
    };
    return icons[platform] || '🌐';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-900/30 border-green-500/50';
      case 'scheduled': return 'text-blue-400 bg-blue-900/30 border-blue-500/50';
      case 'draft': return 'text-gray-400 bg-gray-800/50 border-gray-600/50';
      case 'failed': return 'text-red-400 bg-red-900/30 border-red-500/50';
      default: return 'text-gray-400 bg-gray-800/50 border-gray-600/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Content Scheduler
            </h1>
            <p className="text-gray-400">Plan and manage your content publishing calendar</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors">
              <Zap className="h-4 w-4 mr-2" />
              Auto-Schedule
            </button>
            <button
              onClick={() => console.log('Schedule content')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 flex items-center transition-all duration-200 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Schedule Content
            </button>
          </div>
        </div>

        {/* Publishing Goals */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Publishing Goals</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-8 w-8 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white mb-1">Weekly Goal</h4>
              <p className="text-2xl font-bold text-blue-400 mb-1">{publishingGoals.weekly}</p>
              <p className="text-sm text-gray-400">posts per week</p>
              <div className="mt-2 bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">2/3 this week</p>
            </div>

            <div className="text-center">
              <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Target className="h-8 w-8 text-green-400" />
              </div>
            <h4 className="font-semibold text-white mb-1">Monthly Goal</h4>
            <p className="text-2xl font-bold text-green-400 mb-1">{publishingGoals.monthly}</p>
            <p className="text-sm text-gray-400">posts per month</p>
            <div className="mt-2 bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">5/12 this month</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Globe className="h-8 w-8 text-purple-400" />
            </div>
            <h4 className="font-semibold text-white mb-1">Platforms</h4>
            <p className="text-2xl font-bold text-purple-400 mb-1">{publishingGoals.platforms.length}</p>
            <p className="text-sm text-gray-400">active platforms</p>
            <div className="mt-2 flex justify-center space-x-1">
              {publishingGoals.platforms.map((platform) => (
                <span key={platform} className="text-sm">
                  {getPlatformIcon(platform)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="flex items-center px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors">
            <Settings className="h-4 w-4 mr-2" />
            Adjust Goals
          </button>
        </div>
      </div>

      {/* Scheduled Content List */}
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Scheduled Content</h3>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm">
              <option value="all" className="bg-gray-800">All Status</option>
              <option value="scheduled" className="bg-gray-800">Scheduled</option>
              <option value="draft" className="bg-gray-800">Draft</option>
              <option value="published" className="bg-gray-800">Published</option>
            </select>
            <select className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm">
              <option value="all" className="bg-gray-800">All Platforms</option>
              <option value="wordpress" className="bg-gray-800">WordPress</option>
              <option value="medium" className="bg-gray-800">Medium</option>
              <option value="linkedin" className="bg-gray-800">LinkedIn</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {scheduledContent.map((item) => (
            <div key={item.id} className="bg-gray-700/50 border border-gray-600/50 rounded-lg p-4 hover:bg-gray-700/70 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(`${item.date}T${item.time}`).toLocaleDateString()} at {item.time}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {item.estimatedReadTime}
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      {item.type}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {item.platforms.map((platform) => (
                        <span key={platform} className="text-lg" title={platform}>
                          {getPlatformIcon(platform)}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-1">
                      {item.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Content Templates</h3>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contentTemplates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.type} • {template.frequency}</p>
                </div>
                <div className="flex items-center">
                  <Repeat className="h-4 w-4 text-blue-600" />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-1">
                  {template.platforms.map((platform) => (
                    <span key={platform} className="text-sm" title={platform}>
                      {getPlatformIcon(platform)}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-1">
                  {template.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {template.estimatedTime}
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ContentScheduler;