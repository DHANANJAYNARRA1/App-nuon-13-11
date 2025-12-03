import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Share,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const MentorProfile = ({ navigation, route }) => {
  const { mentor } = route.params;
  const [activeTab, setActiveTab] = useState('about');
  const [isFavorited, setIsFavorited] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${mentor.name}'s profile on NUON - ${mentor.specialization} mentor with ${mentor.rating} rating!`,
        title: `${mentor.name} - NUON Mentor`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    Alert.alert(
      isFavorited ? 'Removed from Favorites' : 'Added to Favorites',
      isFavorited ? 
        `${mentor.name} has been removed from your favorites.` :
        `${mentor.name} has been added to your favorites.`
    );
  };

  const handleBookSession = () => {
    if (!mentor.available) {
      Alert.alert('Unavailable', 'This mentor is currently unavailable for booking.');
      return;
    }
    navigation.navigate('MentorAvailability', {
      mentor: mentor
    });
  };

  const renderAchievementIcon = (iconType) => {
    const iconMap = {
      award: 'award',
      users: 'users',
      star: 'star',
      clock: 'clock',
    };
    return iconMap[iconType] || 'award';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <View style={styles.tabContent}>
            {/* Bio Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="users" size={20} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>About</Text>
              </View>
              <Text style={styles.bioText}>{mentor.bio}</Text>
            </View>

            {/* Qualifications Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="award" size={20} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>Qualifications</Text>
              </View>
              {mentor.qualifications?.map((qual, index) => (
                <View key={index} style={styles.qualificationItem}>
                  <Icon name="check-circle" size={16} color="#10B981" />
                  <Text style={styles.qualificationText}>{qual}</Text>
                </View>
              ))}
            </View>

            {/* Availability Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="clock" size={20} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>Availability</Text>
              </View>
              {mentor.availability?.map((time, index) => (
                <Text key={index} style={styles.availabilityText}>{time}</Text>
              ))}
            </View>

            {/* Languages Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              <View style={styles.languagesContainer}>
                {mentor.languages?.map((lang, index) => (
                  <View key={index} style={styles.languageBadge}>
                    <Text style={styles.languageText}>{lang}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        );

      case 'expertise':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="award" size={20} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>Areas of Expertise</Text>
              </View>
              {mentor.expertise?.map((skill, index) => (
                <View key={index} style={styles.expertiseItem}>
                  <View style={styles.expertiseIcon}>
                    <Icon name="check-circle" size={16} color="white" />
                  </View>
                  <Text style={styles.expertiseText}>{skill}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Session Focus</Text>
              <Text style={styles.bioText}>
                My mentorship sessions are designed to provide practical, actionable guidance for nurses looking to excel in their careers. I focus on:
              </Text>
              <View style={styles.focusItem}>
                <View style={styles.focusBullet} />
                <Text style={styles.focusText}>Real-world clinical scenarios and problem-solving</Text>
              </View>
              <View style={styles.focusItem}>
                <View style={styles.focusBullet} />
                <Text style={styles.focusText}>Career advancement strategies</Text>
              </View>
              <View style={styles.focusItem}>
                <View style={styles.focusBullet} />
                <Text style={styles.focusText}>Building confidence in high-pressure situations</Text>
              </View>
              <View style={styles.focusItem}>
                <View style={styles.focusBullet} />
                <Text style={styles.focusText}>Best practices and latest protocols</Text>
              </View>
            </View>
          </View>
        );

      case 'reviews':
        return (
          <View style={styles.tabContent}>
            {/* Rating Summary */}
            <View style={styles.ratingSummary}>
              <View style={styles.ratingLeft}>
                <Text style={styles.bigRating}>{mentor.rating}</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon key={star} name="star" size={16} color="#F59E0B" />
                  ))}
                </View>
                <Text style={styles.sessionsCount}>{mentor.sessions} sessions</Text>
              </View>
              <View style={styles.ratingRight}>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <View key={rating} style={styles.ratingRow}>
                    <Text style={styles.ratingLabel}>{rating} ★</Text>
                    <View style={styles.ratingBar}>
                      <View 
                        style={[
                          styles.ratingFill,
                          { width: rating === 5 ? '85%' : rating === 4 ? '12%' : '3%' }
                        ]} 
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Individual Reviews */}
            {mentor.reviews?.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerImageContainer}>
                    {review.image ? (
                      <Image source={{ uri: review.image }} style={styles.reviewerImage} />
                    ) : (
                      <View style={styles.reviewerImagePlaceholder}>
                        <Icon name="user" size={20} color="white" />
                      </View>
                    )}
                  </View>
                  <View style={styles.reviewerDetails}>
                    <View style={styles.reviewerHeader}>
                      <Text style={styles.reviewerName}>{review.name}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                    <View style={styles.reviewStars}>
                      {[...Array(review.rating)].map((_, i) => (
                        <Icon key={i} name="star" size={12} color="#F59E0B" />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}

            <Text style={styles.reviewsFooter}>
              Showing {mentor.reviews?.length || 0} of {mentor.sessions} reviews
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#8B5CF6', '#EC4899', '#F59E0B']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Icon name="share-2" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleFavorite}>
                <Icon 
                  name="heart" 
                  size={20} 
                  color={isFavorited ? "#EF4444" : "white"} 
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.headerTitle}>Mentor Profile</Text>
        </LinearGradient>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: mentor.image }} style={styles.profileImage} />
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{mentor.name}</Text>
              <Text style={styles.profileSpecialization}>{mentor.specialization}</Text>
              <View style={styles.profileStats}>
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={16} color="#F59E0B" />
                  <Text style={styles.ratingText}>{mentor.rating}</Text>
                </View>
                <Text style={styles.statSeparator}>•</Text>
                <Text style={styles.sessionsText}>{mentor.sessions} sessions</Text>
              </View>
              <View style={styles.badgesContainer}>
                <View style={[styles.availabilityBadge, { backgroundColor: mentor.available ? '#10B981' : '#EF4444' }]}>
                  <Text style={styles.availabilityText}>
                    {mentor.available ? 'Available' : 'Busy'}
                  </Text>
                </View>
                <View style={styles.experienceBadge}>
                  <Text style={styles.experienceText}>{mentor.experience}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.achievementsContainer}>
            {mentor.achievements?.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <Icon 
                  name={renderAchievementIcon(achievement.icon)} 
                  size={20} 
                  color="#8B5CF6" 
                />
                <Text style={styles.achievementLabel}>{achievement.label}</Text>
              </View>
            ))}
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mentor.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={[styles.statItem, styles.statBorder]}>
              <Text style={styles.statValue}>{mentor.sessions}+</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mentor.responseTime}</Text>
              <Text style={styles.statLabel}>Response</Text>
            </View>
          </View>

          {/* Main Book Button */}
          <TouchableOpacity
            style={[styles.mainBookButton, !mentor.available && styles.disabledButton]}
            onPress={handleBookSession}
            disabled={!mentor.available}
          >
            <LinearGradient
              colors={mentor.available ? ['#8B5CF6', '#EC4899', '#F59E0B'] : ['#9CA3AF', '#9CA3AF']}
              style={styles.mainBookButtonGradient}
            >
              <Icon name="calendar" size={16} color="white" />
              <Text style={styles.mainBookButtonText}>Book Session</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Pricing Info */}
          <View style={styles.pricingInfo}>
            <View style={styles.pricingLeft}>
              <Icon name="video" size={20} color="#8B5CF6" />
              <Text style={styles.pricingText}>45-minute video session</Text>
            </View>
            <View style={styles.pricingRight}>
              <Text style={styles.currency}>₹</Text>
              <Text style={styles.price}>{mentor.price}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsHeader}>
            {['about', 'expertise', 'reviews'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {renderTabContent()}
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPricing}>
          <Text style={styles.bottomPricingLabel}>Session Fee</Text>
          <View style={styles.bottomPricingAmount}>
            <Text style={styles.bottomCurrency}>₹</Text>
            <Text style={styles.bottomPrice}>{mentor.price}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.bottomBookButton, !mentor.available && styles.disabledButton]}
          onPress={handleBookSession}
          disabled={!mentor.available}
        >
          <LinearGradient
            colors={mentor.available ? ['#8B5CF6', '#EC4899', '#F59E0B'] : ['#9CA3AF', '#9CA3AF']}
            style={styles.bottomBookButtonGradient}
          >
            <Icon name="calendar" size={16} color="white" />
            <Text style={styles.bottomBookButtonText}>Book Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 100,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 80,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileCard: {
    marginHorizontal: 24,
    marginTop: -64,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  profileInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  profileImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#E2E8F0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileSpecialization: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  statSeparator: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  sessionsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  experienceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  experienceText: {
    fontSize: 12,
    color: '#6B7280',
  },
  achievementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  achievementItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    flex: 1,
    marginHorizontal: 2,
  },
  achievementLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  mainBookButton: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
  mainBookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  mainBookButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  disabledButton: {
    opacity: 0.5,
  },
  pricingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
  },
  pricingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pricingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  pricingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  currency: {
    fontSize: 20,
    color: '#8B5CF6',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  tabsContainer: {
    marginHorizontal: 24,
    marginTop: 24,
  },
  tabsHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#1F2937',
    fontWeight: 'bold',
  },
  tabContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6B7280',
  },
  qualificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  qualificationText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  availabilityText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  languageText: {
    fontSize: 14,
    color: '#6B7280',
  },
  expertiseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  expertiseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expertiseText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
    marginTop: 8,
  },
  focusBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
    marginTop: 6,
  },
  focusText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  ratingSummary: {
    flexDirection: 'row',
    gap: 16,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ratingLeft: {
    alignItems: 'center',
  },
  bigRating: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  sessionsCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  ratingRight: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#6B7280',
    width: 32,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  reviewerImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  reviewerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  reviewerImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  reviewDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  reviewsFooter: {
    textAlign: 'center',
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomPricing: {
    alignItems: 'flex-start',
  },
  bottomPricingLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomPricingAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bottomCurrency: {
    fontSize: 20,
    color: '#8B5CF6',
  },
  bottomPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  bottomBookButton: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  bottomBookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  bottomBookButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default MentorProfile;