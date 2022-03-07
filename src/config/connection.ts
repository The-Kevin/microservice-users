import amqp from 'amqplib';

export default amqp.connect(process.env.AMQP_URL);
