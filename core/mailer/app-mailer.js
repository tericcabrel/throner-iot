import hbs from 'nodemailer-express-handlebars';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

const user = process.env.MAILER_USER ;
const pass = process.env.MAILER_PASSWORD ;
const host = process.env.MAILER_HOST ;

const handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: path.join(__dirname, '../../templates/'),
  extName: '.html'
};

let smtpTransport = nodemailer.createTransport({
  host: host,
  port: 2525,
  auth: {
    user: user,
    pass: pass
  }
});

smtpTransport.use('compile', hbs(handlebarsOptions));

export default smtpTransport;