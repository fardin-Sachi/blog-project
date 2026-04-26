import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';
export const loginUser = async (req, res) => {
    try {
        const { email, name, image } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                image,
            });
        }
        const token = jwt.sign({
            user
        }, process.env.JWT_SECRET, { expiresIn: "5d" });
        res.status(200).json({
            success: true,
            token,
            user
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
//# sourceMappingURL=user.controller.js.map