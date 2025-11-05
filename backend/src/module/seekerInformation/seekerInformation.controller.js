
import SeekerInformationModel from "./seekerInformation.model.js";
import UserModel from '../../models/user.model.js'



// export const CreateOrupdateSeekerInfo = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const {
//             firstName,
//             middletName,
//             nickName,
//             gender,
//             maritalStatus,
//             phone,
//             mobile,
//             streetAddress,
//             youTubeVideoLink,
//             jobExperience,
//             careerLevel,
//             industry,
//             functionalArea,
//             salaryCurrency,
//             currentSalary,
//             expectedSalary,
//             subscribetoNewsletter,
//             country,
//             state,
//             city,
//             dateofBirth,
//         } = req.body;

//         let profileImagePath = req.file ? `/uploads/seekar/${req.file.filename}` : undefined;

//         // ✅ Check if profile already exists
//         let seekerInfo = await SeekerInformationModel.findOne({ user: userId });

//         if (seekerInfo) {
//             // ✅ Update existing profile
//             seekerInfo.set({
//                 firstName,
//                 middletName,
//                 nickName,
//                 gender,
//                 maritalStatus,
//                 phone,
//                 mobile,
//                 streetAddress,
//                 youTubeVideoLink,
//                 jobExperience,
//                 careerLevel,
//                 industry,
//                 functionalArea,
//                 salaryCurrency,
//                 currentSalary,
//                 expectedSalary,
//                 subscribetoNewsletter,
//                 country,
//                 state,
//                 city,
//                 dateofBirth,
//                 ...(profileImagePath && { profileImage: profileImagePath }),
//             });

//             await seekerInfo.save();
//         } else {
//             // ✅ Create new profile
//             seekerInfo = await SeekerInformationModel.create({
//                 user: userId,
//                 firstName,
//                 middletName,
//                 nickName,
//                 gender,
//                 maritalStatus,
//                 phone,
//                 mobile,
//                 streetAddress,
//                 youTubeVideoLink,
//                 jobExperience,
//                 careerLevel,
//                 industry,
//                 functionalArea,
//                 salaryCurrency,
//                 currentSalary,
//                 expectedSalary,
//                 subscribetoNewsletter,
//                 country,
//                 state,
//                 city,
//                 dateofBirth,
//                 profileImage: profileImagePath,
//             });
//         }

//         // ✅ Update main User model with profileImage
//         await UserModel.findByIdAndUpdate(
//             userId,
//             {
//                 firstName,
//                 lastName: middletName,
//                 // ✅ IMPORTANT: Also update profilePicture in User model
//                 ...(profileImagePath && { profilePicture: profileImagePath }),
//             },
//             { new: true }
//         );

//         // ✅ Send proper response with profileImage
//         res.status(200).json({
//             success: true,
//             message: "Profile updated successfully",
//             data: {
//                 ...seekerInfo.toObject(),
//                 profileImage: seekerInfo.profileImage // ✅ Ensure profileImage is sent
//             },
//         });

//     } catch (error) {
//         console.error("❌ Error in createOrUpdateSeekerInfo:", error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// }

// export const getSeekerInfoByUser = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const seekerInfo = await SeekerInformationModel.findOne({ user: userId });

//         if (!seekerInfo) {
//             return res.status(404).json({ success: false, message: "Profile not found" });
//         }

//         // ✅ Ensure profileImage is included in response
//         res.status(200).json({ 
//             success: true, 
//             data: {
//                 ...seekerInfo.toObject(),
//                 profileImage: seekerInfo.profileImage
//             }
//         });
//     } catch (error) {
//         console.error("❌ Error in getSeekerInfoByUser:", error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };


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
            summary
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
                summary,
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
                summary,
                profileImage: profileImagePath,
            });
        }

        // ✅ Update main User model with profileImage
        await UserModel.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName: middletName,
                // ✅ IMPORTANT: Also update profilePicture in User model
                ...(profileImagePath && { profilePicture: profileImagePath }),
            },
            { new: true }
        );

        // ✅ Send proper response with profileImage
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                ...seekerInfo.toObject(),
                profileImage: seekerInfo.profileImage // ✅ Ensure profileImage is sent
            },
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
             .populate('user')
            .populate('functionalArea', 'name')
            .populate('industry', 'name')
            .populate('careerLevel', 'name');

        if (!seekerInfo) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        // ✅ Ensure profileImage is included in response
        res.status(200).json({
            success: true,
            data: {
                ...seekerInfo.toObject(),
                profileImage: seekerInfo.profileImage
            }
        });
    } catch (error) {
        console.error("❌ Error in getSeekerInfoByUser:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};