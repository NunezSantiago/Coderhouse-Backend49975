import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport(
    {
        service: 'gmail',
        port: 587,
        auth:{
            user: 'santiago.nunez.2202@gmail.com',
            pass: 'hpvozwulmxarovtq'
        }
    }
)

export const sendEmail = (to, subject, message) => {
    return transport.sendMail({
        to, subject, html:message
    })
}