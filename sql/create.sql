-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Term
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Term
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Term` DEFAULT CHARACTER SET utf8 ;
USE `Term` ;

-- -----------------------------------------------------
-- Table `Term`.`Customer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term`.`Customer` (
  `Email` VARCHAR(50) NOT NULL,
  `Phone` VARCHAR(45) NULL,
  `Address` VARCHAR(512) NULL,
  `Name` VARCHAR(45) NULL,
  `Role` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(45) NULL,
  PRIMARY KEY (`Email`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term`.`Author`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term`.`Author` (
  `Name` VARCHAR(45) NULL,
  `URL` VARCHAR(45) NULL,
  `Address` VARCHAR(512) NULL,
  `ID` INT NOT NULL,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term`.`Book`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term`.`Book` (
  `ISBN` INT NOT NULL,
  `Category` VARCHAR(45) NULL,
  `Price` DECIMAL(10,2) NULL,
  `Title` VARCHAR(255) NULL,
  `Year` YEAR(4) NULL,
  `Author_ID` INT NOT NULL,
  PRIMARY KEY (`ISBN`, `Author_ID`),
  INDEX `fk_Book_Author1_idx` (`Author_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Book_Author1`
    FOREIGN KEY (`Author_ID`)
    REFERENCES `Term`.`Author` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term`.`Reservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term`.`Reservation` (
  `Book_ISBN` INT NOT NULL,
  `Customer_Email` VARCHAR(50) NOT NULL,
  `ID` INT NOT NULL,
  `Reservation_date` DATETIME NULL,
  `Pickup_time` DATETIME NULL,
  PRIMARY KEY (`ID`),
  INDEX `fk_Book_has_Customer_Customer1_idx` (`Customer_Email` ASC) VISIBLE,
  INDEX `fk_Book_has_Customer_Book_idx` (`Book_ISBN` ASC) VISIBLE,
  CONSTRAINT `fk_Book_has_Customer_Book`
    FOREIGN KEY (`Book_ISBN`)
    REFERENCES `Term`.`Book` (`ISBN`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Book_has_Customer_Customer1`
    FOREIGN KEY (`Customer_Email`)
    REFERENCES `Term`.`Customer` (`Email`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term`.`Shopping_basket`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term`.`Shopping_basket` (
  `BasketID` INT NOT NULL,
  `Order_date` DATETIME NULL,
  `Customer_Email` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`BasketID`),
  INDEX `fk_Shopping_basket_Customer1_idx` (`Customer_Email` ASC) VISIBLE,
  CONSTRAINT `fk_Shopping_basket_Customer1`
    FOREIGN KEY (`Customer_Email`)
    REFERENCES `Term`.`Customer` (`Email`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term`.`Contains`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term`.`Contains` (
  `Book_ISBN` INT NOT NULL,
  `Shopping_basket_BasketID` INT NOT NULL,
  `Number` INT NULL,
  PRIMARY KEY (`Book_ISBN`, `Shopping_basket_BasketID`),
  INDEX `fk_Book_has_Shopping_basket_Shopping_basket1_idx` (`Shopping_basket_BasketID` ASC) VISIBLE,
  INDEX `fk_Book_has_Shopping_basket_Book1_idx` (`Book_ISBN` ASC) VISIBLE,
  CONSTRAINT `fk_Book_has_Shopping_basket_Book1`
    FOREIGN KEY (`Book_ISBN`)
    REFERENCES `Term`.`Book` (`ISBN`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Book_has_Shopping_basket_Shopping_basket1`
    FOREIGN KEY (`Shopping_basket_BasketID`)
    REFERENCES `Term`.`Shopping_basket` (`BasketID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term`.`Award`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term`.`Award` (
  `Name` VARCHAR(45) NULL,
  `Year` YEAR(4) NULL,
  `ID` INT NOT NULL,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term`.`Award_has_Book`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term`.`Award_has_Book` (
  `Award_ID` INT NOT NULL,
  `Book_ISBN` INT NOT NULL,
  PRIMARY KEY (`Award_ID`, `Book_ISBN`),
  INDEX `fk_Award_has_Book_Book1_idx` (`Book_ISBN` ASC) VISIBLE,
  INDEX `fk_Award_has_Book_Award1_idx` (`Award_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Award_has_Book_Award1`
    FOREIGN KEY (`Award_ID`)
    REFERENCES `Term`.`Award` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Award_has_Book_Book1`
    FOREIGN KEY (`Book_ISBN`)
    REFERENCES `Term`.`Book` (`ISBN`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term`.`Warehouse`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term`.`Warehouse` (
  `Code` INT NOT NULL,
  `Phone` VARCHAR(45) NULL,
  `Address` VARCHAR(512) NULL,
  PRIMARY KEY (`Code`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term`.`Inventory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term`.`Inventory` (
  `Warehouse_Code` INT NOT NULL,
  `Book_ISBN` INT NOT NULL,
  `Number` INT NULL,
  PRIMARY KEY (`Warehouse_Code`, `Book_ISBN`),
  INDEX `fk_Warehouse_has_Book_Book1_idx` (`Book_ISBN` ASC) VISIBLE,
  INDEX `fk_Warehouse_has_Book_Warehouse1_idx` (`Warehouse_Code` ASC) VISIBLE,
  CONSTRAINT `fk_Warehouse_has_Book_Warehouse1`
    FOREIGN KEY (`Warehouse_Code`)
    REFERENCES `Term`.`Warehouse` (`Code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Warehouse_has_Book_Book1`
    FOREIGN KEY (`Book_ISBN`)
    REFERENCES `Term`.`Book` (`ISBN`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term`.`Author_has_Award`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term`.`Author_has_Award` (
  `Author_ID` INT NOT NULL,
  `Award_ID` INT NOT NULL,
  PRIMARY KEY (`Author_ID`, `Award_ID`),
  INDEX `fk_Author_has_Award_Award1_idx` (`Award_ID` ASC) VISIBLE,
  INDEX `fk_Author_has_Award_Author1_idx` (`Author_ID` ASC) VISIBLE,
  CONSTRAINT `fk_Author_has_Award_Author1`
    FOREIGN KEY (`Author_ID`)
    REFERENCES `Term`.`Author` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Author_has_Award_Award1`
    FOREIGN KEY (`Award_ID`)
    REFERENCES `Term`.`Award` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
