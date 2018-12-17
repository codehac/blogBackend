const express = require('express')
const mongoose = require('mongoose')
const shortid = require('shortid')
const time = require('./../libs/timeLib')
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib')
const check = require('./../libs/checkLib')

const BlogModel = mongoose.model('Blog');

let getAllBlog = (req, res) => {
  console.log(req.body);
  BlogModel.find()
    .select('-__v -_id')
    .lean()
    .exec((err, result) => {
      if (err) {
        logger.error(err.message, 'Blog Controller: getAllBlog', 10)
        let apiResponse = response.generate(true, 'Failed to Find Blog Details', null)
        res.send(apiResponse)
      } else if (check.isEmpty(result)) {
        logger.info('No Blog found', 'Blog Controller: getAllBlog')
        let apiResponse = reponse.generate(true, 'No blog found', 404, null)
        res.send(apiResponse)
        res.send('No Blog Found')
      } else {
        let apiResponse = response.generate(false, 'All Blog Found details', 200, result)
        res.send(apiResponse)
      }
    })
}


let viewByBlogId = (req, res) => {
  if (check.isEmpty(req.params.blogId)) {
    logger.error('blogId is not found', 'Blog Controller: viewByBlogId', 10)
    let apiResponse = response.generate('true', 'blogId is missing', 404, null)
    res.send(apiResponse)
  } else {
    BlogModel.findOne({ 'blogId': req.params.blogId }, (err, result) => {
      if (err) {
        console.log(err)
        logger.error(`Error Occured:${error}`, 'Database', 10)
        let apiResponse = reponse.generate(true, 'Error Occured.', 500, null)
        res.send(apiResponse);
      } else if (check.isEmpty(result)) {
        console.log('No blog is found ')
        let apiResponse = response.generate('true', 'Blog Not Found', 404, null)
        res.send(apiResponse)
      } else {
        logger.info('Blog found successfully', 'Blog Controller: viewByBlogId', 5)
        let apiResponse = response.generate(false, 'Blog Found Sucessfully', 200, result)
        res.send(apiResponse)
      }
    })
  }

}
let viewByCategory = (req, res) => {
  if (check.isEmpty(req.params.blogId)) {
    logger.error('blogId is not found', 'Blog Controller: viewByCategory', 10)
    let apiResponse = response.generate('true', 'blogId is missing', 404, null)
    res.send(apiResponse)
  } else {
    BlogModel.findOne({ 'category': req.params.category }, (err, result) => {
      if (err) {
        console.log(err);
        logger.error(`Error Occured:${error}`, 'Database', 10)
        let apiResponse = reponse.generate(true, 'Error Occured.', 500, null)
        res.send(apiResponse);
      } else if (check.isEmpty(result)) {
        console.log('No Blog is found');
        let apiResponse = response.generate('true', 'Blog Not Found', 404, null)
        res.send(apiResponse)
      } else {
        logger.info('Blog found successfully', 'Blog Controller: viewByCategory ', 5)
        let apiResponse = response.generate(false, 'Blog Found Sucessfully', 200, result)
        res.send(apiResponse)
      }

    })
  }
}
let viewByAuthor = (req, res) => {
  if (check.isEmpty(req.params.author)) {
    logger.error('blogId is not found', 'Blog Controller: vviewByAutho', 10)
    let apiResponse = response.generate('true', 'author is missing', 404, null)
    res.send(apiResponse)
  } else {
    BlogModel.findOne({ 'author': req.params.author }, (err, result) => {
      if (err) {
        console.log(err)
        logger.error(`Error Occured:${error}`, 'Database', 10)
        let apiResponse = reponse.generate(true, 'Error Occured.', 500, null)
        res.send(apiResponse);
      } else if (check.isEmpty(result)) {
        let apiResponse = response.generate('true', 'Blog Not Found', 404, null)
        res.send(apiResponse)
      } else {
        logger.info('Blog found successfully', 'Blog Controller: viewByCategory ', 5)
        let apiResponse = response.generate(false, 'Blog Found Sucessfully', 200, result)
        res.send(apiResponse)
      }
    })
  }
}

let editBlog = (req, res) => {
  if (check.isEmpty(req.params.blogId)) {
    logger.error('blogId is not found', 'Blog Controller: editBlog', 10)
    let apiResponse = response.generate('true', 'blogId is missing', 404, null)
    res.send(apiResponse)
  } else {
    let option = req.body;
    console.log(option);
    BlogModel.update({ 'blogId': req.params.blogId }, option, { multi: true }).exec((err, result) => {
      if (err) {
        console.log(err)
        logger.error(`Error Occured:${error}`, 'Database', 10)
        let apiResponse = reponse.generate(true, 'Error Occured.', 500, null)
        res.send(apiResponse);
      } else if (check.isEmpty(result)) {
        consoe.log('No blog is found')
        let apiResponse = response.generate('true', 'Blog Not Found', 404, null)
        res.send(apiResponse)
      } else {
        logger.info('Blog edited successfully', 'Blog Controller: vditBlog ', 5)
        let apiResponse = response.generate(false, 'Blog edited Sucessfully', 200, result)
        res.send(apiResponse)
      }
    })
  }
}
let deleteBlog = (req, res) => {
  BlogModel.remove({ 'blogId': req.params.blogId }, (err, result) => {
    if (err) {
      console.log(err)
      res.send(err)
    } else if (result == undefined || result == null || result == '') {
      console.log('No Blog Found')
      res.send('No Blog is Found')
    } else {
      res.send(result)
    }
  })
}


let createBlog = (req, res) => {
  let blogCreationFunction = () => {
    return new Promise((resolve, reject) => {
      console.log(req.body)

      if (check.isEmpty(req.body.title) || check.isEmpty(req.body.description) || check.isEmpty(req.body.blogBody) || check.isEmpty(req.body.category)) {
        console.log('403, forbidden request')
        console.log(req.body.category);
        let apiResponse = response.generate(true, 'required information is missing', 403, null)
        reject(apiResponse)
      } else {
        var today = time.now()
        let blogId = shortid.generate()
        let newBlog = new BlogModel({
          blogId: blogId,
          title: req.body.title,
          description: req.body.description,
          bodyHtml: req.body.blogBody,
          isPublished: true,
          category: req.body.category,
          author: req.body.fullName,
          created: today,
          lastModified: today
        })
        let tags = (req.body.tags != undefined && req.body.tags != null && req.body.tags != '') ? body.split(',') : [];
        newBlog.tags = tags
        newBlog.save((err, result) => {
          if (err) {
            console.log(err)
            logger.error(`Error Occured: ${err}`, 'Database', 10)
            let apiResponse = reponse.generate(true, 'Error Occured', 500, null)
            reject(apiResponse)
          } else {
            resolve(result)
          }
        })
      }
    })
  }
  blogCreationFunction()
    .then((result) => {
      let apiResponse = response.generate(false, 'Blog created Successfully', 200, result)
      res.send(apiResponse)
    })
    .catch((error) => {
      console.log(error)
      res.send(error)
    })
}






let increaseBlogView = (req, res) => {
  if (check.isEmpty(req.params.blogId)) {

    console.log('blogId should be passed')
    let apiResponse = response.generate(true, 'blogId is missing', 403, null)
    res.send(apiResponse)
  } else {

    BlogModel.findOne({ 'blogId': req.params.blogId }, (err, result) => {
      if (err) {
        console.log(err)
        logger.error(`Error Occured : ${err}`, 'Database', 10)
        let apiResponse = response.generate(true, 'Error Occured.', 500, null)
        res.send(apiResponse)
      } else if (check.isEmpty(result)) {
        console.log('Blog Not Found.')
        let apiResponse = response.generate(true, 'Blog Not Found', 404, null)
        res.send(apiResponse)
      } else {
        result.views += 1;
        result.save(function (err, result) {
          if (err) {
            console.log('Error Occured.')
            logger.error(`Error Occured : ${err}`, 'Database', 10)
            let apiResponse = response.generate(true, 'Error Occured While saving blog', 500, null)
            res.send(apiResponse)
          } else {
            console.log('Blog Updated Successfully')
            let apiResponse = response.generate(false, 'Blog Updated Successfully.', 200, result)
            res.send(apiResponse)
          }
        });
      }
    })
  }
}



module.exports = {
  getAllBlog: getAllBlog,
  createBlog: createBlog,
  viewByBlogId: viewByBlogId,
  viewByCategory: viewByCategory,
  viewByAuthor: viewByAuthor,
  editBlog: editBlog,
  deleteBlog: deleteBlog,
  increaseBlogView: increaseBlogView
}
