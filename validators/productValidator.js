import { body } from 'express-validator'

export const productValidator = [
    body('name')
      .isLength({min: 1})
      .trim()
      .withMessage('A product must have a name'),
    body('category')
      .isLength({min: 1})
      .trim()
      .withMessage('Product must have aa category'),
    body('price').isLength({min: 1})
      .isNumeric()
      .withMessage('Price must be greater than 0'),

    body('description')
      .isLength({ min: 3})
      .trim()
      .withMessage('Product must have a description')
  ];