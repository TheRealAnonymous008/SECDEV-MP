-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema usersmydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`RoleEnum`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`RoleEnum` ;

CREATE TABLE IF NOT EXISTS `mydb`.`RoleEnum` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Id`, `Name`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Picture`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Picture` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Picture` (
  `Id` INT NOT NULL,
  `Picture` LONGBLOB NOT NULL,
  PRIMARY KEY (`Id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Users` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Users` (
  `Id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `FirstName` VARCHAR(45) NOT NULL,
  `LastName` VARCHAR(45) NOT NULL,
  `Username` VARCHAR(128) NOT NULL,
  `Password` VARCHAR(128) NOT NULL,
  `Salt` VARCHAR(45) NOT NULL,
  `Role` INT NOT NULL,
  `MobileNumber` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `PictureId` INT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE,
  INDEX `fk_Users_RoleEnum1_idx` (`Role` ASC) VISIBLE,
  UNIQUE INDEX `Username_UNIQUE` (`Username` ASC) VISIBLE,
  INDEX `fk_Users_Picture1_idx` (`PictureId` ASC) VISIBLE,
  CONSTRAINT `fk_Users_RoleEnum1`
    FOREIGN KEY (`Role`)
    REFERENCES `mydb`.`RoleEnum` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Users_Picture1`
    FOREIGN KEY (`PictureId`)
    REFERENCES `mydb`.`Picture` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Customer`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Customer` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Customer` (
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
-- Table `mydb`.`Vehicle`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Vehicle` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Vehicle` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `LicensePlate` VARCHAR(8) NULL,
  `Manufacturer` VARCHAR(45) NULL,
  `Model` VARCHAR(45) NULL,
  `YearManufactured` DATETIME NULL,
  `Color` VARCHAR(45) NULL,
  `Engine` VARCHAR(45) NULL,
  `Remarks` VARCHAR(256) NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TypeEnum`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`TypeEnum` ;

CREATE TABLE IF NOT EXISTS `mydb`.`TypeEnum` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Id`, `Name`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`StatusEnum`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`StatusEnum` ;

CREATE TABLE IF NOT EXISTS `mydb`.`StatusEnum` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Id`, `Name`),
  UNIQUE INDEX `Id_UNIQUE` (`Id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Order`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Order` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Order` (
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
    REFERENCES `mydb`.`Customer` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Order_Vehicle1`
    FOREIGN KEY (`VehicleId`)
    REFERENCES `mydb`.`Vehicle` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Order_TypeEnum1`
    FOREIGN KEY (`TypeId`)
    REFERENCES `mydb`.`TypeEnum` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Order_StatusEnum1`
    FOREIGN KEY (`Status`)
    REFERENCES `mydb`.`StatusEnum` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Data for table `mydb`.`RoleEnum`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`RoleEnum` (`Id`, `Name`) VALUES (1, 'ADMIN');
INSERT INTO `mydb`.`RoleEnum` (`Id`, `Name`) VALUES (2, 'VIEW EDIT');
INSERT INTO `mydb`.`RoleEnum` (`Id`, `Name`) VALUES (3, 'VIEW');

COMMIT;


-- -----------------------------------------------------
-- Data for table `mydb`.`TypeEnum`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`TypeEnum` (`Id`, `Name`) VALUES (1, 'PERSONAL');
INSERT INTO `mydb`.`TypeEnum` (`Id`, `Name`) VALUES (2, 'WALK IN');
INSERT INTO `mydb`.`TypeEnum` (`Id`, `Name`) VALUES (3, 'FLEET');
INSERT INTO `mydb`.`TypeEnum` (`Id`, `Name`) VALUES (4, 'INSURANCE');

COMMIT;


-- -----------------------------------------------------
-- Data for table `mydb`.`StatusEnum`
-- -----------------------------------------------------
START TRANSACTION;
USE `mydb`;
INSERT INTO `mydb`.`StatusEnum` (`Id`, `Name`) VALUES (1, 'PAID');
INSERT INTO `mydb`.`StatusEnum` (`Id`, `Name`) VALUES (2, 'UNPAID');
INSERT INTO `mydb`.`StatusEnum` (`Id`, `Name`) VALUES (3, 'OK');
INSERT INTO `mydb`.`StatusEnum` (`Id`, `Name`) VALUES (4, 'PENDING');
INSERT INTO `mydb`.`StatusEnum` (`Id`, `Name`) VALUES (5, 'WITH BALANCE');
INSERT INTO `mydb`.`StatusEnum` (`Id`, `Name`) VALUES (6, 'QUOTE OR CHJECK');
INSERT INTO `mydb`.`StatusEnum` (`Id`, `Name`) VALUES (7, 'FOR LOA OR INVOICE');

COMMIT;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
