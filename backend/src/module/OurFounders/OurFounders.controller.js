import OurFoundersSchemaModel from './OurFounders.model.js';

export const getAllOurFounders = async (req, res) => {
  try {
    const founders = await OurFoundersSchemaModel.find();
    res.json(founders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch founders', error });
  }
};

export const createOurFounder = async (req, res) => {
  try {
    const { name, description, desgination } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const image = `/uploads/${req.file.filename}`;

    const founder = await OurFoundersSchemaModel.create({
      name,
      image,
      description,
      desgination
    });

    res.status(201).json({
      success: true,
      message: 'Founder created successfully',
      founder
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create founder', error });
  }
};

export const updateOurFounder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, desgination } = req.body;

    const updateData = { name, description, desgination };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedFounder = await OurFoundersSchemaModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedFounder) {
      return res.status(404).json({ message: 'Founder not found' });
    }

    res.json({
      success: true,
      message: 'Founder updated successfully',
      founder: updatedFounder
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update founder', error });
  }
};

export const deleteOurFounder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFounder = await OurFoundersSchemaModel.findByIdAndDelete(id);

    if (!deletedFounder) {
      return res.status(404).json({ message: 'Founder not found' });
    }

    res.json({
      success: true,
      message: 'Founder deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete founder', error });
  }
};