import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const SessionFeedback = ({ route, navigation }) => {
  const { mentor, sessionDetails } = route.params || {};
  const [ratings, setRatings] = useState({
    overall: 0,
    communication: 0,
    knowledge: 0,
    helpfulness: 0,
  });
  const [feedback, setFeedback] = useState('');
  const [recommend, setRecommend] = useState(null);

  const handleRating = (category, rating) => {
    setRatings(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const renderStars = (category, currentRating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRating(category, star)}
            style={styles.starButton}
          >
            <Icon
              name="star"
              size={24}
              color={star <= currentRating ? '#F59E0B' : '#E5E7EB'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleSubmit = () => {
    if (ratings.overall === 0) {
      Alert.alert('Required', 'Please provide an overall rating.');
      return;
    }

    // Here you would typically send the feedback to your backend
    Alert.alert(
      'Thank You!',
      'Your feedback has been submitted successfully.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MentorshipSessions')
        }
      ]
    );
  };

  const sessionData = sessionDetails || {
    topic: 'Career Guidance Session',
    date: 'Nov 18, 2024',
    time: '2:00 PM - 2:45 PM',
    duration: '45 minutes',
  };

  const mentorData = mentor || {
    name: 'Dr. Sunita Verma',
    specialization: 'Critical Care',
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
            <Text style={styles.headerTitle}>Session Feedback</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Session Summary */}
          <View style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <View style={styles.sessionIcon}>
                <Icon name="check-circle" size={24} color="#10B981" />
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTitle}>Session Completed</Text>
                <Text style={styles.sessionSubtitle}>Thank you for your feedback!</Text>
              </View>
            </View>

            <View style={styles.sessionDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mentor:</Text>
                <Text style={styles.detailValue}>{mentorData.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Topic:</Text>
                <Text style={styles.detailValue}>{sessionData.topic}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{sessionData.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duration:</Text>
                <Text style={styles.detailValue}>{sessionData.duration}</Text>
              </View>
            </View>
          </View>

          {/* Overall Rating */}
          <View style={styles.ratingCard}>
            <Text style={styles.ratingTitle}>Overall Experience</Text>
            <Text style={styles.ratingSubtitle}>How would you rate this mentoring session?</Text>
            {renderStars('overall', ratings.overall)}
          </View>

          {/* Detailed Ratings */}
          <View style={styles.ratingCard}>
            <Text style={styles.ratingTitle}>Detailed Feedback</Text>
            <Text style={styles.ratingSubtitle}>Rate specific aspects of the session</Text>

            <View style={styles.detailedRating}>
              <Text style={styles.aspectLabel}>Communication Skills</Text>
              {renderStars('communication', ratings.communication)}
            </View>

            <View style={styles.detailedRating}>
              <Text style={styles.aspectLabel}>Knowledge & Expertise</Text>
              {renderStars('knowledge', ratings.knowledge)}
            </View>

            <View style={styles.detailedRating}>
              <Text style={styles.aspectLabel}>Helpfulness</Text>
              {renderStars('helpfulness', ratings.helpfulness)}
            </View>
          </View>

          {/* Written Feedback */}
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>Additional Comments</Text>
            <Text style={styles.feedbackSubtitle}>Share your thoughts about the session (optional)</Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="What did you learn? Any suggestions for improvement?"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={feedback}
              onChangeText={setFeedback}
              textAlignVertical="top"
            />
          </View>

          {/* Recommendation */}
          <View style={styles.recommendCard}>
            <Text style={styles.recommendTitle}>Would you recommend this mentor?</Text>
            <View style={styles.recommendButtons}>
              <TouchableOpacity
                style={[
                  styles.recommendButton,
                  recommend === true && styles.recommendButtonSelected
                ]}
                onPress={() => setRecommend(true)}
              >
                <Icon
                  name="thumbs-up"
                  size={20}
                  color={recommend === true ? "white" : "#6B7280"}
                />
                <Text style={[
                  styles.recommendButtonText,
                  recommend === true && styles.recommendButtonTextSelected
                ]}>
                  Yes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.recommendButton,
                  recommend === false && styles.recommendButtonSelected
                ]}
                onPress={() => setRecommend(false)}
              >
                <Icon
                  name="thumbs-down"
                  size={20}
                  color={recommend === false ? "white" : "#6B7280"}
                />
                <Text style={[
                  styles.recommendButtonText,
                  recommend === false && styles.recommendButtonTextSelected
                ]}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899', '#F59E0B']}
            style={styles.submitButtonGradient}
          >
            <Icon name="send" size={20} color="white" />
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
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
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  sessionSubtitle: {
    fontSize: 14,
    color: '#10B981',
  },
  sessionDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  ratingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  ratingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    padding: 4,
  },
  detailedRating: {
    marginBottom: 16,
  },
  aspectLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  feedbackCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  feedbackSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
  },
  recommendCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 100, // Space for bottom bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  recommendButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  recommendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  recommendButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  recommendButtonText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  recommendButtonTextSelected: {
    color: 'white',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default SessionFeedback;