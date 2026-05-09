const Address = require("../models/addressModel");

exports.addAddress = async (req, res) => {
  try {
    const { userId, doorNo, line1, line2, city, state, pincode, contact } = req.body;

    console.log("userId",userId)
    if (!userId) {
      return res.status(400).json({ message: "UserId missing" });
    }

    const address = await Address.create({
      user:userId,
      doorNo,
      line1,
      line2,
      city,
      state,
      pincode,
      contact,
    });

    res.status(201).json({
      success: true,
      address,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getAddresses = async (req, res) => {
  try {
    const {userId} = req.body
    const addresses = await Address.find({user:userId});

    res.json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};


exports.setDefaultAddress = async (req, res) => {
  try {
    const {userId,addressId} = req.body;

    await Address.updateMany(
        { user: userId }, 
        { isDefault: false }
    );

    const address = await Address.findByIdAndUpdate(
      addressId,
      { isDefault: true },
      { new: true }
    );

    res.json({ 
        success: true,
        address 
    });

  } catch (error) {
    res.status(500).json({ 
        message:error.message 
    });
  }
};


exports.deleteAddress = async (req, res) => {
  try {
    console.log(req.body,"req")
    const {addressId} = req.body
    console.log("addressId",addressId)

    const address = await Address.findByIdAndDelete(addressId);
    console.log("address",address)

    if(!address){
        res.status(404).json({
            success:false,
            message:"address not found"
        })
    }

    res.status(200).json(
        {success: true}
    );
  } catch (error) {
    res.status(500).json({ 
        success: false 
    });
  }
};

exports.editAddress = async(req,res) => {
    try {
        const { addressId,doorNo, line1, line2, city, state, pincode, contact} = req.body

        if(!addressId){
            return res.status(400).json({
                success:false,
                message:"AddressId is required"
            })
        }

        const updateAddress = await Address.findByIdAndUpdate(
            addressId,
            {
                doorNo,
                line1, 
                line2, 
                city, 
                state, 
                pincode, 
                contact
            },
            {new:true}
        )

        if(!updateAddress){
            return res.status(404).json({
                success:false,
                message:"Address not found"
            })
        }

        res.status(200).json({
            success:true,
            address: updateAddress
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:error.message
        })
    }
}