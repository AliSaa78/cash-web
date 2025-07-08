import express from "express";
import protect from "../middlewares/protectMiddleware.js";
import pagination from "../middlewares/pagination.js";
import transController from "../controllers/transController.js";

const router = express.Router();


//transfer
  /**
 * @swagger
 * /transfer:
 *   post:
 *     summary: Transfer money from the current user to another user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - amount
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: MongoDB ObjectId of the recipient
 *                 example: 665d8af98c1e7e049c6b1290
 *               amount:
 *                 type: number
 *                 description: Amount to transfer
 *                 example: 100
 *     responses:
 *       200:
 *         description: Transfer succeeded
 *       400:
 *         description: Validation or balance error
 *       403:
 *         description: Unauthorized (missing or invalid token)
 */ 
router.post("/transfer",protect,transController.transfer);
/**
 * @swagger
 * /alltransactions:
 *   get:
 *     summary: Get all transactions where the user is sender or receiver
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Results per page (default 10)
 *     responses:
 *       200:
 *         description: Paginated list of transactions
 *       400:
 *         description: No transactions found
 */
//view the trasactions history
router.get("/alltransactions",protect,pagination,transController.transactions);
/**
 * @swagger
 * /sendingTransactions:
 *   get:
 *     summary: Get transactions where the user is the sender
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *     responses:
 *       200:
 *         description: Paginated list of sent transactions
 *       400:
 *         description: No transactions found
 */
//only when you are the sender
router.get("/sendingTransactions",protect,pagination,transController.sendingTransactions);
/**
 * @swagger
 * /receivingTransactions:
 *   get:
 *     summary: Get transactions where the user is the receiver
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *     responses:
 *       200:
 *         description: Paginated list of received transactions
 *       400:
 *         description: No transactions found
 */
//only when you are the receiver
router.get("/receivingTransactions",protect,pagination,transController.receivingTransactions);
/**
 * @swagger
 * /withdrawal:
 *   post:
 *     summary: Withdraw money from the current user’s balance
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *       400:
 *         description: Validation error or insufficient balance
 *       403:
 *         description: Daily withdrawal limit reached
 */
//withdrawal money 
router.post("/withdrawal",protect,transController.withdraw);
/**
 * @swagger
 * /deposit:
 *   post:
 *     summary: Deposit money to the current user’s balance
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 150
 *     responses:
 *       200:
 *         description: Deposit successful
 *       400:
 *         description: Validation error (amount <= 0)
 */
//deposit money
router.post("/deposit",protect,transController.deposit);
export default router;