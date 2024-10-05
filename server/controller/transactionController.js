const TransactionDb = require('../model/transactions')
const Userdb = require('../model/schema')

// controller for registerOrder
exports.registerTransaction = async (req,res)=>{
    try {

        // validate request
        if(!req.body){
            res.status(406).json({ err : "You have to fill the registration form!"})
            return
        }

        let {
            order_id,
            customer,
            product_item,
            date,
            total_amount,
            created_by,

            ...otherFields
        } = req.body

        // Determine the user creating the product. If req.user is not available, use the system user.

        if (created_by) {
            const userWithFields = await Userdb.findById(created_by._id)
                        .populate('_id', '_id fullname email phone_number address') 
            created_by = userWithFields; // Assuming req.user contains the user's _id.
        } else {
            // Set created_by to the user_id of the system user.
            const systemUser = await Userdb.findOne({ username: "system_user" }) // Replace with your system user's identifier (e.g., username).
                                .populate('_id', '_id fullname email phone_number address') 
            created_by = systemUser;
        }

        // using document structure
        const newTransaction = new TransactionDb({
            order_id,
            customer,
            product_item,
            date,
            total_amount,

            created_on : date,
            created_by,

            ...otherFields
        })
        newTransaction
            .save(newTransaction)
            .then(register=>{
                res.json(register)
            })
            .catch(error=>{
                res.status(406).json({err : error.message || "Something went wrong while order registration"})
            })

    } catch (error) {
        res.status(500).json({err: error.message || "Error while transaction registration"})
    }
}

// controller for loadTransactions
exports.loadTransactions = async (req,res)=>{
    const query = req.query.new;
    try {
      const orders = query
        ? await TransactionDb.find().sort({ _id: -1 }).limit(10)
        // .populate('customer_id', 'fullname email') 
        // .populate('product_item.product', 'product_name price') 
        : await TransactionDb.find()
        // .populate('customer_id', 'fullname email') 
        // .populate('product_item.product', 'product_name price') ;
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json("Find Error");
    }
}

// controller for loadTransactionbyID
exports.loadTransactionbyID = async (req, res) => {
    try {
      const transaction = await TransactionDb.findById(req.params.id)
        res.status(200).json(transaction);
      
    } catch (error) {
      res.status(500).json(error);
    }
}

// controller for dynamic loadOrderByFilter
exports.loadTransactionByFilter = async (req,res)=>{
    const query = req.query;
    try {
        let filter = {}
        for (const key in query) {
            if (key) {
                filter[key] = query[key]
            } 
        }
        let transaction;
        if (query) {
            transaction = await TransactionDb.find(filter).sort({ _id: -1 }).limit(10);
        }
            res.status(200).json(transaction);
        } catch (error) {
            res.status(500).json("Find Error");
        }
}

// controller for updateTransaction
exports.updateTransaction = async (req,res)=>{
    try {
        // Determine the user creating the product. If req.user is not available, use the system user.
        let updated_by;

        if (req.user) {
            const userWithFields = await Userdb.findById(req.user._id)
                        .populate('_id', '_id fullname email phone_number address') 
            updated_by = userWithFields; // Assuming req.user contains the user's _id.
        } else {
            // Set updated_by to the user_id of the system user.
            const systemUser = await Userdb.findOne({ username: "system_user" }) // Replace with your system user's identifier (e.g., username).
                                .populate('_id', '_id fullname email phone_number address') 
            updated_by = systemUser;
        }

        // Create the current date
        const currentDate = new Date();
        var updated_on = currentDate.toLocaleString();

        // Add `updated_by` and `updated_on` to req.body
        req.body.updated_by = updated_by;
        req.body.updated_on = updated_on;

        const updateTransaction  = await TransactionDb.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updateTransaction);
      } catch (error) {
        res.status(500).json(error);
      }
}

// controller for deleteTransaction
exports.deleteTransaction = async (req,res)=>{
    try {
        await TransactionDb.findByIdAndDelete(req.params.id)
        res.json({msg: "Transaction Deleted Successfully"})
    } catch (error) {
        res.status(500).json({err:error.message || "Error while deleting Transaction"})
    }
}