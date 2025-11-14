import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Avatar,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Skeleton
} from '@mui/material';
import {
  PlayArrow,
  Schedule,
  Person,
  LocationOn,
  Group,
  BookmarkBorder,
  Share,
  Close,
  CalendarToday
} from '@mui/icons-material';
import axios from 'axios';

const Activities = () => {
  const [tabValue, setTabValue] = useState(0);
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      
      const [coursesRes, eventsRes, workshopsRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/api/courses`),
        axios.get(`${API_BASE}/api/events`),
        axios.get(`${API_BASE}/api/workshops`)
      ]);

      setCourses(coursesRes.status === 'fulfilled' && coursesRes.value.data ? 
        (Array.isArray(coursesRes.value.data.courses) ? coursesRes.value.data.courses : 
         Array.isArray(coursesRes.value.data) ? coursesRes.value.data : []) : []);
      setEvents(eventsRes.status === 'fulfilled' && eventsRes.value.data ? 
        (Array.isArray(eventsRes.value.data.events) ? eventsRes.value.data.events : 
         Array.isArray(eventsRes.value.data) ? eventsRes.value.data : []) : []);
      setWorkshops(workshopsRes.status === 'fulfilled' && workshopsRes.value.data ? 
        (Array.isArray(workshopsRes.value.data.workshops) ? workshopsRes.value.data.workshops : 
         Array.isArray(workshopsRes.value.data) ? workshopsRes.value.data : []) : []);

    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openDetails = (item, type) => {
    setSelectedItem({ ...item, type });
    setOpenDialog(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const renderContentCard = (item, type) => (
    <Grid item xs={12} sm={6} md={4} key={item._id}>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
          }
        }}
      >
        {/* Image/Video Thumbnail */}
        {item.imageUrl && (
          <CardMedia
            component="img"
            height="200"
            image={`${API_BASE}${item.imageUrl}`}
            alt={item.title}
            sx={{ 
              objectFit: 'cover',
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
            }}
          />
        )}

        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          {/* Title */}
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {item.title}
          </Typography>

          {/* Description */}
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              opacity: 0.9,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {item.description}
          </Typography>

          {/* Details Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: '#FFD700' }}>
                <Person sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="caption">
                {item.instructor?.name || 'Admin'}
              </Typography>
            </Box>

            {type === 'course' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Schedule sx={{ fontSize: 16, color: '#FFD700' }} />
                <Typography variant="caption">{item.duration}</Typography>
              </Box>
            )}
          </Box>

          {/* Date and Time for Events/Workshops */}
          {(type === 'event' || type === 'workshop') && item.date && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CalendarToday sx={{ fontSize: 16, color: '#FFD700' }} />
              <Typography variant="caption">
                {formatDate(item.date)}
                {item.time && ` at ${formatTime(item.time)}`}
              </Typography>
            </Box>
          )}

          {/* Venue for Events/Workshops */}
          {(type === 'event' || type === 'workshop') && item.venue && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: '#FFD700' }} />
              <Typography variant="caption">
                {typeof item.venue === 'string' ? item.venue : item.venue.name || 'TBD'}
              </Typography>
            </Box>
          )}

          {/* Capacity for Events/Workshops */}
          {(type === 'event' || type === 'workshop') && item.capacity && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <Group sx={{ fontSize: 16, color: '#FFD700' }} />
              <Typography variant="caption">
                {item.registeredCount || 0}/{item.capacity} participants
              </Typography>
            </Box>
          )}

          {/* Price */}
          <Box sx={{ mt: 'auto', pt: 1 }}>
            <Chip 
              label={item.price > 0 ? `₹${item.price}` : 'Free'} 
              sx={{ 
                bgcolor: '#FFD700', 
                color: '#000', 
                fontWeight: 'bold',
                '& .MuiChip-label': {
                  px: 2
                }
              }} 
            />
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button 
            fullWidth
            variant="contained"
            onClick={() => openDetails(item, type)}
            sx={{ 
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(45deg, #FFA500, #FFD700)',
                transform: 'scale(1.02)'
              }
            }}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderLoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card sx={{ height: 400 }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} width="60%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderEmptyState = (type) => (
    <Box 
      sx={{ 
        textAlign: 'center', 
        py: 8,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 2,
        color: 'white'
      }}
    >
      <Typography variant="h5" gutterBottom>
        No {type}s Available
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.8 }}>
        Check back later for new {type}s!
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          NEON Activities
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            opacity: 0.7,
            mb: 3
          }}
        >
          Discover courses, events, and workshops to enhance your nursing skills
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          centered
          sx={{
            '& .MuiTab-root': {
              fontWeight: 'bold',
              fontSize: '1.1rem',
              '&.Mui-selected': {
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }
            }
          }}
        >
          <Tab label={`Courses (${courses.length})`} />
          <Tab label={`Events (${events.length})`} />
          <Tab label={`Workshops (${workshops.length})`} />
        </Tabs>
      </Box>

      {/* Content */}
      {loading ? (
        renderLoadingSkeleton()
      ) : (
        <>
          {/* Courses Tab */}
          {tabValue === 0 && (
            <Box>
              {courses.length > 0 ? (
                <Grid container spacing={3}>
                  {courses.map((course) => renderContentCard(course, 'course'))}
                </Grid>
              ) : (
                renderEmptyState('course')
              )}
            </Box>
          )}

          {/* Events Tab */}
          {tabValue === 1 && (
            <Box>
              {events.length > 0 ? (
                <Grid container spacing={3}>
                  {events.map((event) => renderContentCard(event, 'event'))}
                </Grid>
              ) : (
                renderEmptyState('event')
              )}
            </Box>
          )}

          {/* Workshops Tab */}
          {tabValue === 2 && (
            <Box>
              {workshops.length > 0 ? (
                <Grid container spacing={3}>
                  {workshops.map((workshop) => renderContentCard(workshop, 'workshop'))}
                </Grid>
              ) : (
                renderEmptyState('workshop')
              )}
            </Box>
          )}
        </>
      )}

      {/* Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedItem && (
          <>
            <DialogTitle sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h5" component="span" sx={{ fontWeight: 'bold' }}>
                {selectedItem.title}
              </Typography>
              <IconButton 
                onClick={() => setOpenDialog(false)}
                sx={{ color: 'white' }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 3 }}>
              {selectedItem.imageUrl && (
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <img 
                    src={`${API_BASE}${selectedItem.imageUrl}`}
                    alt={selectedItem.title}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              )}

              <Typography variant="body1" paragraph>
                {selectedItem.description}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Price
                  </Typography>
                  <Typography variant="h6">
                    {selectedItem.price > 0 ? `₹${selectedItem.price}` : 'Free'}
                  </Typography>
                </Grid>

                {(selectedItem.type === 'event' || selectedItem.type === 'workshop') && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Date & Time
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(selectedItem.date)}
                        {selectedItem.time && (
                          <><br />{formatTime(selectedItem.time)}</>
                        )}
                      </Typography>
                    </Grid>

                    {selectedItem.venue && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Venue
                        </Typography>
                        <Typography variant="body1">
                          {typeof selectedItem.venue === 'string' ? selectedItem.venue : selectedItem.venue.name || 'TBD'}
                        </Typography>
                      </Grid>
                    )}

                    {selectedItem.capacity && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Capacity
                        </Typography>
                        <Typography variant="body1">
                          {selectedItem.registeredCount || 0}/{selectedItem.capacity} participants
                        </Typography>
                      </Grid>
                    )}
                  </>
                )}

                {selectedItem.type === 'course' && selectedItem.duration && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Duration
                    </Typography>
                    <Typography variant="body1">
                      {selectedItem.duration}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button 
                variant="contained"
                size="large"
                sx={{ 
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  px: 4
                }}
                onClick={() => {
                  // TODO: Implement enrollment/registration logic
                  alert(`Enrolling in ${selectedItem.title}...`);
                }}
              >
                {selectedItem.type === 'course' ? 'Enroll Now' : 'Register'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Activities;