const AIService = require('../services/aiService');

// @desc Generate Structured Task from Natural Prompt
// @route POST /api/ai/parse-task
exports.parseTask = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Please provide a prompt describing your task' });
    }

    const taskObj = await AIService.generateTaskFromPrompt(prompt, req.user);
    res.json({
      success: true,
      data: taskObj
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
