import connectQlik from 'arc-design/data-providers/qlik/connectQlik';

const config = {
    host: 'localhost',
    port: 19076,
    appname: 'AUM and Flows_Scramble_ExpDeOpt.qvf'
}

const QaeContext = connectQlik(config);

console.log(QaeContext);

export default QaeContext;