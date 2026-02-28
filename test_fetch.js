import http from 'http';

http.get('http://localhost:8000/models/bar.glb', res => {
    console.log('status', res.statusCode);
    res.resume();
    res.on('end', () => process.exit(0));
}).on('error', e => {
    console.error('err', e.message);
    process.exit(1);
});