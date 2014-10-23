module.exports = {
  queue: 'image_queue'
, timeout: 0
, outputPath: '/Users/preston/projects/copycat/public/img/'
, fileExt: '.png'
, pg: {
    connStr: 'postgresql://preston@localhost:5432/copycat'
  , name: 'copycat'
  }
};
