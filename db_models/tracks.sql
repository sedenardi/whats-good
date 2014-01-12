CREATE TABLE `tracks` (
  `trackId` INT(11) NOT NULL AUTO_INCREMENT,
  `artistId` INT(11) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `url` VARCHAR(100) NOT NULL,
  `raw` TEXT NOT NULL,
  PRIMARY KEY (`trackId`),
  INDEX `FK_tracks_artistId` (`artistId`),
  CONSTRAINT `FK_tracks_artistId` FOREIGN KEY (`artistId`) REFERENCES `artists` (`artistId`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;
