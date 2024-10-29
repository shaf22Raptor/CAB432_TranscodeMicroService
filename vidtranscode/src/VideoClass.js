// Class used to store video meta-data as object
class VideoInfo {
  constructor(originalName, fileName, fileSize, uploadTime) {
    this.originalName = originalName;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.uploadTime = uploadTime;
  }
}

export default VideoInfo;