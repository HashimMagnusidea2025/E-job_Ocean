// controllers/CMS.controllers.js

import CMSModel from '../models/CMS.model.js';

export const getCMS = async (req, res) => {
  try {
    const cmsData = await CMSModel.findOne(); 
    res.json(cmsData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch CMS data', error });
  }
};

export const updateCMS = async (req, res) => {
  try {
    const updateData = req.body;

    // If logo uploaded
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }

    const updatedCMS = await CMSModel.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });

    res.json(updatedCMS);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update CMS data', error });
  }
};