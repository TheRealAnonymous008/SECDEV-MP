-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema autoworks
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `autoworks` ;

-- -----------------------------------------------------
-- Schema autoworks
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `autoworks` DEFAULT CHARACTER SET utf8 ;
USE `autoworks` ;

-- -----------------------------------------------------
-- Table `autoworks`.`RoleEnum`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `autoworks`.`RoleEnum` ;

CREATE TABLE IF NOT EXISTS `autoworks`.`RoleEnum` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Id`, `Name`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `autoworks`.`Users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `autoworks`.`Users` ;

CREATE TABLE IF NOT EXISTS `autoworks`.`Users` (
  `Id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `FirstName` VARCHAR(45) NOT NULL,
  `LastName` VARCHAR(45) NOT NULL,
  `Username` VARCHAR(128) NOT NULL,
  `Password` VARCHAR(128) NOT NULL,
  `Salt` VARCHAR(45) NOT NULL,
  `Role` INT NOT NULL,
  `MobileNumber` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `Picture` VARCHAR(100) NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE,
  INDEX `fk_Users_RoleEnum1_idx` (`Role` ASC) VISIBLE,
  UNIQUE INDEX `Username_UNIQUE` (`Username` ASC) VISIBLE,
  CONSTRAINT `fk_Users_RoleEnum1`
    FOREIGN KEY (`Role`)
    REFERENCES `autoworks`.`RoleEnum` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `autoworks`.`Customer`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `autoworks`.`Customer` ;

CREATE TABLE IF NOT EXISTS `autoworks`.`Customer` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `FirstName` VARCHAR(45) NULL,
  `LastName` VARCHAR(45) NULL,
  `MobileNumber` VARCHAR(11) NULL,
  `Email` VARCHAR(45) NULL,
  `Company` VARCHAR(45) NULL,
  `Insurance` VARCHAR(45) NULL,
  `Remarks` VARCHAR(256) NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `autoworks`.`Vehicle`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `autoworks`.`Vehicle` ;

CREATE TABLE IF NOT EXISTS `autoworks`.`Vehicle` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `LicensePlate` VARCHAR(8) NULL,
  `Manufacturer` VARCHAR(45) NULL,
  `Model` VARCHAR(45) NULL,
  `YearManufactured` INT NULL,
  `Color` VARCHAR(45) NULL,
  `Engine` VARCHAR(45) NULL,
  `Remarks` VARCHAR(256) NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `autoworks`.`TypeEnum`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `autoworks`.`TypeEnum` ;

CREATE TABLE IF NOT EXISTS `autoworks`.`TypeEnum` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Id`, `Name`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `autoworks`.`StatusEnum`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `autoworks`.`StatusEnum` ;

CREATE TABLE IF NOT EXISTS `autoworks`.`StatusEnum` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Id`, `Name`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `autoworks`.`Order`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `autoworks`.`Order` ;

CREATE TABLE IF NOT EXISTS `autoworks`.`Order` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Status` INT NOT NULL,
  `TimeIn` DATETIME NULL,
  `TimeOut` DATETIME NULL,
  `CustomerId` INT NOT NULL,
  `TypeId` INT NOT NULL,
  `VehicleId` INT NOT NULL,
  `EstimateNumber` VARCHAR(45) NULL,
  `ScopeOfWork` VARCHAR(1024) NULL,
  `IsVerified` TINYINT NOT NULL,
  PRIMARY KEY (`ID`),
  INDEX `fk_Order_Customer_idx` (`CustomerId` ASC) VISIBLE,
  INDEX `fk_Order_Vehicle1_idx` (`VehicleId` ASC) VISIBLE,
  INDEX `fk_Order_TypeEnum1_idx` (`TypeId` ASC) VISIBLE,
  CONSTRAINT `fk_Order_Customer`
    FOREIGN KEY (`CustomerId`)
    REFERENCES `autoworks`.`Customer` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Order_Vehicle1`
    FOREIGN KEY (`VehicleId`)
    REFERENCES `autoworks`.`Vehicle` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Order_TypeEnum1`
    FOREIGN KEY (`TypeId`)
    REFERENCES `autoworks`.`TypeEnum` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Order_StatusEnum1`
    FOREIGN KEY (`Status`)
    REFERENCES `autoworks`.`StatusEnum` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `autoworks`.`Sessions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `autoworks`.`Sessions` ;

CREATE TABLE IF NOT EXISTS `autoworks`.`Sessions` (
  `SessionId` VARCHAR(128) NOT NULL,
  `UserId` INT UNSIGNED NOT NULL,
  `SessionTime` BIGINT NOT NULL,
  `Csrf` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`SessionId`, `UserId`, `SessionTime`, `Csrf`),
  INDEX `fk_user_session_idx` (`UserId` ASC) VISIBLE,
  CONSTRAINT `fk_user_session`
    FOREIGN KEY (`UserId`)
    REFERENCES `autoworks`.`Users` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Data for table `autoworks`.`RoleEnum`
-- -----------------------------------------------------
START TRANSACTION;
USE `autoworks`;
INSERT INTO `autoworks`.`RoleEnum` (`Id`, `Name`) VALUES (1, 'ADMIN');
INSERT INTO `autoworks`.`RoleEnum` (`Id`, `Name`) VALUES (2, 'VIEW EDIT');
INSERT INTO `autoworks`.`RoleEnum` (`Id`, `Name`) VALUES (3, 'VIEW');

COMMIT;


-- -----------------------------------------------------
-- Data for table `autoworks`.`TypeEnum`
-- -----------------------------------------------------
START TRANSACTION;
USE `autoworks`;
INSERT INTO `autoworks`.`TypeEnum` (`Id`, `Name`) VALUES (1, 'PERSONAL');
INSERT INTO `autoworks`.`TypeEnum` (`Id`, `Name`) VALUES (2, 'WALK IN');
INSERT INTO `autoworks`.`TypeEnum` (`Id`, `Name`) VALUES (3, 'FLEET');
INSERT INTO `autoworks`.`TypeEnum` (`Id`, `Name`) VALUES (4, 'INSURANCE');

COMMIT;


-- -----------------------------------------------------
-- Data for table `autoworks`.`StatusEnum`
-- -----------------------------------------------------
START TRANSACTION;
USE `autoworks`;
INSERT INTO `autoworks`.`StatusEnum` (`Id`, `Name`) VALUES (1, 'PAID');
INSERT INTO `autoworks`.`StatusEnum` (`Id`, `Name`) VALUES (2, 'UNPAID');
INSERT INTO `autoworks`.`StatusEnum` (`Id`, `Name`) VALUES (3, 'OK');
INSERT INTO `autoworks`.`StatusEnum` (`Id`, `Name`) VALUES (4, 'PENDING');
INSERT INTO `autoworks`.`StatusEnum` (`Id`, `Name`) VALUES (5, 'WITH BALANCE');
INSERT INTO `autoworks`.`StatusEnum` (`Id`, `Name`) VALUES (6, 'QUOTE OR CHJECK');
INSERT INTO `autoworks`.`StatusEnum` (`Id`, `Name`) VALUES (7, 'FOR LOA OR INVOICE');

COMMIT;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
