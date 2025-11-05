
import SeekerInformationModel from "./seekerInformation.model.js";
import UserModel from '../../models/user.model.js'



export const CreateOrupdateSeekerInfo = async (req, res) => {

    try {

        const userId = req.user.id;
        const {
            firstName,
            middletName,
            nickName,
            gender,
            maritalStatus,
            phone,
            mobile,
            streetAddress,
            youTubeVideoLink,
            jobExperience,
            careerLevel,
            industry,
            functionalArea,
            salaryCurrency,
            currentSalary,
            expectedSalary,
            subscribetoNewsletter,
            country,
            state,
            city,
            dateofBirth,
        } = req.body;

        let profileImagePath = req.file ? `/uploads/seekar/${req.file.filename}` : undefined;

        // ✅ Check if profile already exists
        let seekerInfo = await SeekerInformationModel.findOne({ user: userId });


        if (seekerInfo) {
            // ✅ Update existing profile
            seekerInfo.set({
                firstName,
                middletName,
                nickName,
                gender,
                maritalStatus,
                phone,
                mobile,
                streetAddress,
                youTubeVideoLink,
                jobExperience,
                careerLevel,
                industry,
                functionalArea,
                salaryCurrency,
                currentSalary,
                expectedSalary,
                subscribetoNewsletter,
                country,
                state,
                city,
                dateofBirth,
                ...(profileImagePath && { profileImage: profileImagePath }),
            });

            await seekerInfo.save();
        } else {
            // ✅ Create new profile
            seekerInfo = await SeekerInformationModel.create({
                user: userId,
                firstName,
                middletName,
                nickName,
                gender,
                maritalStatus,
                phone,
                mobile,
                streetAddress,
                youTubeVideoLink,
                jobExperience,
                careerLevel,
                industry,
                functionalArea,
                salaryCurrency,
                currentSalary,
                expectedSalary,
                subscribetoNewsletter,
                country,
                state,
                city,
                dateofBirth,
                profileImage: profileImagePath,
            });
        }


        // ✅ Update main User model (if needed)
        await UserModel.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName: middletName,
             

            },
            { new: true }
        );


        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: seekerInfo,
        });

    } catch (error) {
        console.error("❌ Error in createOrUpdateSeekerInfo:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}





export const getSeekerInfoByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const seekerInfo = await SeekerInformationModel.findOne({ user: userId })
    //   .populate("country", "name")
    //   .populate("state", "name")
    //   .populate("city", "name");

    if (!seekerInfo) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, data: seekerInfo });
  } catch (error) {
    console.error("❌ Error in getSeekerInfoByUser:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};