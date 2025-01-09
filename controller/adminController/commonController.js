const Admin = require('../../models/adminSchema');


const getDashboard = async(req, res)=>{
    try{
        res.render('admin/dashboard')
    }catch(err){
        console.log('getDashboard error : ',err);
    }
}

const getLogin = async (req, res) => {
    try {
      res.render('admin/login');
    } catch (error) {
      console.log(error)
    }
  }

  const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminData = await Admin.findOne({ "email": email });
        console.log("ADMIN : ",adminData);
        console.log("ADMIN : ",adminData.isAdmin);
      if (adminData && adminData.isAdmin) {
        if (password === adminData.password) {
          req.session.isAdmin = true;
          req.session.adminData = adminData
          res.redirect('/admin')
        } else {
          req.flash('error_msg', 'Password incorrect')
          res.redirect('/admin/login')
        }
      } else {
        console.log('invalid admin')
        req.flash('error_msg', 'Enter valid Email')
        res.redirect('/admin/login')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getLogout = async (req, res)=>{
    try{
        req.session.destroy();
        res.redirect('/admin/login');
    }catch(err){
        console.log('getLogout error : ',err);
    }
  }
  

  module.exports = {
    getDashboard,
    getLogin,
    postLogin,
    getLogout
  }