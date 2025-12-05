import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, ChevronLeft, Search, Filter, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MentorshipSessionsProps {
  onNavigate: (page: string) => void;
}

export function MentorshipSessions({ onNavigate }: MentorshipSessionsProps) {
  const [displayName, setDisplayName] = useState('Priya');

  useEffect(() => {
    const savedData = localStorage.getItem('nurseProfile');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.fullName) {
        const firstName = parsed.fullName.split(' ')[0];
        setDisplayName(firstName);
      }
    }
  }, []);

  const upcomingSessions = [
    {
      id: 1,
      mentor: 'Dr. Anjali Reddy',
      topic: 'Advanced Wound Care',
      date: 'Tomorrow',
      time: '3:00 PM',
      duration: '45 mins',
      image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      type: 'Video Call',
    },
    {
      id: 2,
      mentor: 'Nurse Priya Singh',
      topic: 'Career Development Q&A',
      date: 'Oct 15',
      time: '5:00 PM',
      duration: '30 mins',
      image: 'https://images.unsplash.com/photo-1747833305853-d43937d88971?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3JzaGlwJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MDM0NTM0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      type: 'Video Call',
    },
  ];

  const availableMentors = [
    {
      id: 1,
      name: 'Dr. Sunita Verma',
      specialization: 'Critical Care',
      experience: '15+ years',
      rating: 4.9,
      sessions: 340,
      image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      specialization: 'Emergency Medicine',
      experience: '12+ years',
      rating: 4.8,
      sessions: 280,
      image: 'https://images.unsplash.com/photo-1747833305853-d43937d88971?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3JzaGlwJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MDM0NTM0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true,
    },
    {
      id: 3,
      name: 'Nurse Kavita Sharma',
      specialization: 'Pediatric Care',
      experience: '10+ years',
      rating: 4.9,
      sessions: 420,
      image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-600 via-teal-600 to-blue-600 text-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-xl sticky top-0 z-10">
        <h2 className="text-white mb-4">Find Mentors</h2>
        
        {/* Search Bar */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
          <Input
            type="search"
            placeholder="Search mentors..."
            className="pl-10 pr-12 rounded-xl h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder:text-white/60"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <Filter className="h-5 w-5 text-white/60" />
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="browse">Browse Mentors</TabsTrigger>
            <TabsTrigger value="upcoming">My Sessions</TabsTrigger>
          </TabsList>

          {/* Browse Mentors Tab */}
          <TabsContent value="browse" className="space-y-4">
            {availableMentors.map((mentor) => (
              <Card 
                key={mentor.id} 
                className="shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-purple-200"
              >
                <CardContent className="p-4">
                  <div className="flex gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-purple-100">
                        <ImageWithFallback
                          src={mentor.image}
                          alt={mentor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3>{mentor.name}</h3>
                        <div className="flex items-center gap-1 text-sm bg-yellow-50 px-2 py-1 rounded-full">
                          <span className="text-yellow-600">★</span>
                          <span className="font-medium">{mentor.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{mentor.specialization}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{mentor.experience}</span>
                        <span>•</span>
                        <span>{mentor.sessions} sessions</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-full border-2 hover:bg-purple-50"
                      onClick={() => {
                        // Navigate to mentor profile
                        onNavigate('activity-details', { 
                          type: 'mentor', 
                          data: mentor 
                        });
                      }}
                    >
                      View Profile
                    </Button>
                    <Button
                      className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      disabled={!mentor.available}
                      onClick={() => {
                        if (mentor.available) {
                          // Navigate to booking slots page
                          onNavigate('booking-slots', mentor);
                        }
                      }}
                    >
                      {mentor.available ? 'Book Session' : 'Unavailable'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* My Sessions Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <Card key={session.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600">
                          <ImageWithFallback
                            src={session.image}
                            alt={session.mentor}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1">{session.mentor}</h3>
                        <p className="text-sm text-gray-600 mb-3">{session.topic}</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{session.date}</span>
                            <Clock className="h-4 w-4 ml-2" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="secondary" className="rounded-full">
                              <Video className="h-3 w-3 mr-1" />
                              {session.type}
                            </Badge>
                            <Badge variant="outline" className="rounded-full">
                              {session.duration}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1 rounded-full"
                        onClick={() => {
                          // Navigate to reschedule page with session data
                          onNavigate('reschedule-session', session);
                        }}
                      >
                        Reschedule
                      </Button>
                      <Button 
                        className="flex-1 rounded-full bg-gradient-to-r from-green-600 to-green-700"
                        onClick={() => {
                          // Navigate to session preparation page
                          onNavigate('session-preparation', session);
                        }}
                      >
                        Join Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-gray-900 mb-2">No Upcoming Sessions</h3>
                <p className="text-gray-600 mb-6">Book a session with a mentor to get started</p>
                <Button onClick={() => {}} className="rounded-full">
                  Browse Mentors
                </Button>
              </div>
            )}
          </TabsContent>


        </Tabs>
      </div>
    </div>
  );
}
