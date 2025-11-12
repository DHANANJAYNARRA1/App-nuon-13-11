const NCCStatus = require('../models/NCCStatus');

const getNccStatus = async (req, res) => {
  try {
    const { userId } = req.query;
    const targetUserId = userId || req.user._id;

    let nccStatus = await NCCStatus.findOne({ userId: targetUserId })
      .populate('userId', 'name email');

    if (!nccStatus) {
      nccStatus = await NCCStatus.create({ userId: targetUserId });
      nccStatus = await NCCStatus.findById(nccStatus._id)
        .populate('userId', 'name email');
    }

    res.json(nccStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNccStep = async (req, res) => {
  try {
    const { step, completed } = req.body;
    const { userId } = req.query;
    const targetUserId = userId || req.user._id;

    let nccStatus = await NCCStatus.findOne({ userId: targetUserId });

    if (!nccStatus) {
      nccStatus = await NCCStatus.create({ userId: targetUserId });
    }

    // Update specific step
    switch (step) {
      case 'assessment':
        nccStatus.assessmentPass = completed;
        if (completed) nccStatus.currentStep = 'interview';
        break;
      case 'interview':
        nccStatus.interviewDone = completed;
        if (completed) nccStatus.currentStep = 'leadership';
        break;
      case 'leadership':
        nccStatus.leadershipDone = completed;
        if (completed) nccStatus.currentStep = 'completed';
        break;
    }

    // Update final status
    if (nccStatus.assessmentPass && nccStatus.interviewDone && nccStatus.leadershipDone) {
      nccStatus.finalStatus = 'completed';
    } else if (nccStatus.assessmentPass || nccStatus.interviewDone || nccStatus.leadershipDone) {
      nccStatus.finalStatus = 'in_progress';
    }

    await nccStatus.save();

    const populatedStatus = await NCCStatus.findById(nccStatus._id)
      .populate('userId', 'name email');

    res.json(populatedStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get public NCC information
const getNccInfo = async (req, res) => {
  try {
    res.json({
      success: true,
      program: {
        name: "Nursing Career Champion (NCC)",
        description: "A comprehensive leadership development program for nursing professionals",
        benefits: [
          "Advanced leadership training",
          "Career advancement opportunities",
          "Networking with healthcare leaders",
          "Certification upon completion",
          "Mentorship opportunities"
        ],
        requirements: [
          "Registered Nurse license",
          "Minimum 2 years experience",
          "Commitment to leadership development",
          "Active participation in program activities"
        ],
        duration: "6 months",
        steps: [
          { name: "Assessment", description: "Initial skills assessment" },
          { name: "Interview", description: "Personal interview with panel" },
          { name: "Leadership Training", description: "Comprehensive leadership program" },
          { name: "Certification", description: "Final certification and recognition" }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching NCC information',
      error: error.message
    });
  }
};

module.exports = {
  getNccStatus,
  updateNccStep,
  getNccInfo
};