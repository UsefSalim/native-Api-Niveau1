/* eslint-disable no-await-in-loop */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
const moment = require('moment');
const Fawn = require('fawn');
const Rdv = require('../models/Rdv.models');
const Personne = require('../models/Personne.models');

exports.addRdv = async (req, res) => {
  const { id } = req.params;
  const task = Fawn.Task();
  const newP = new Personne({
    ...req.body,
  });
  const createRdv = await task
    .update(
      'rdv',
      { _id: id },
      { $set: { id_personne: newP._id, rdv_honorer: true } }
    )
    .save('personne', newP)
    .run({ useMongoose: true });
  if (createRdv) return res.status(201).json('rdv valider');
};

const dateSearch = (date) => {
  const formatDate = date.toISOString().split('T')[0];
  return formatDate.concat('T23:00:00.000+00:00');
};
exports.rdvDuJour = async (req, res) => {
  const searchDate = dateSearch(new Date());
  const allRdv = await Rdv.find({ date_rdv: searchDate, rdv_honorer: false });
  return res.status(200).json(allRdv);
};

const vacation = (date, nombre_rdv) => {
  const day = moment(date, 'YYYY-DD-MM').format('dddd');
  switch (day) {
    case 'Monday':
    case 'Tuesday':
    case 'Wednesday':
    case 'Thursday':
    case 'Friday':
      return nombre_rdv;
    case 'Saturday':
      return nombre_rdv % 2 === 0 ? nombre_rdv / 2 : (nombre_rdv - 1) / 2;
    default:
      return 0;
  }
};

const dayDifference = (start, end) => moment.duration(end.diff(start)).asDays();

exports.createRdv = async (req, res) => {
  const { nombre_rdv, heur_depart, date_fin, date_depart } = req.body;
  const startWithHours = moment(
    `${date_depart} ${heur_depart}`,
    'YYYY-DD-MM hh:mm'
  );
  const start = moment(`${date_depart} ${heur_depart}`, 'YYYY-DD-MM');
  const end = moment(date_fin, 'YYYY-DD-MM');
  const dayNumber = dayDifference(start, end);
  for (let day = 1; day <= dayNumber; day++) {
    const date = moment(date_depart, 'YYYY-DD-MM').add(day, 'days');
    const datev = moment(date_depart, 'YYYY-DD-MM').add(day - 1, 'days');
    const vac = vacation(datev, nombre_rdv);
    for (let rdv = 0; rdv < vac; rdv++) {
      const heur = moment(startWithHours)
        .add(15 * rdv, 'm')
        .format('hh:min');
      const newRdv = new Rdv({
        num_rdv: rdv + 1,
        heur_rdv: heur,
        date_rdv: date,
      });
      await newRdv.save();
    }
  }
  return res.status(201).json({ message: 'rdv created succesfully' });
};
