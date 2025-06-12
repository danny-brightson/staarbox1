create database staarbox;

CREATE TABLE `lkpstatusid` (
  `CreatedTime` date DEFAULT NULL,
  `ModefiedTime` date DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `lkpstate` (
  `ModefiedTime` date DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `StatusId` bigint DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  `State` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lkpavailabledistrict` (
  `ModefiedTime` date DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `StatusId` bigint DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `District` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `lkpgender` (
  `ModefiedTime` date DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `StatusId` bigint DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `GenderName` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lkppackdetails` (
  `ModefiedTime` date DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `StatusId` bigint DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  `PackageName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lkpdeliverytimings` (
  `ModefiedTime` date DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `StatusId` bigint DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `DeliveryTiming` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `dailytagline` (
  `ModefiedTime` date DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `StatusId` bigint DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  `TagLine` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `availablepincodes` (
  `ModefiedTime` date DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `StatusId` bigint DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `District` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  `PinCode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `pincodedetails` (
  `ModefiedTime` date DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `StatusId` bigint DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  `PinCode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `customerdetails` (
  `Age` int DEFAULT NULL,
  `CustomerStatusId` bit(1) DEFAULT NULL,
  `DelivaryTimingId` int DEFAULT NULL,
  `DistrictId` int DEFAULT NULL,
  `IsAlergic` bit(1) DEFAULT NULL,
  `IsCustomized` bit(1) DEFAULT NULL,
  `IsEggPreferred` bit(1) DEFAULT NULL,
  `IsPaymentSuccess` bit(1) DEFAULT NULL,
  `IsPragnent` bit(1) DEFAULT NULL,
  `IsRenewed` bit(1) DEFAULT NULL,
  `ModefiedTime` date DEFAULT NULL,
  `PackDetailsId` int DEFAULT NULL,
  `StateId` int DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `DateOfBirth` datetime(6) DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `LastCustomizedDate` datetime(6) DEFAULT NULL,
  `NextRenewalDate` datetime(6) DEFAULT NULL,
  `PaymentStatus` bigint DEFAULT NULL,
  `RenewedDate` datetime(6) DEFAULT NULL,
  `StatusId` bigint DEFAULT NULL,
  `AddressLine1` varchar(255) DEFAULT NULL,
  `AddressLine2` varchar(255) DEFAULT NULL,
  `AddressType` varchar(255) DEFAULT NULL,
  `AlergicFruits` varchar(255) DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `GenderId` varchar(255) DEFAULT NULL,
  `MailId` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `OrderId` varchar(255) DEFAULT NULL,
  `PhoneNumber` varchar(255) DEFAULT NULL,
  `PinCode` varchar(255) DEFAULT NULL,
  `Token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `availablepromocode` (
  `IsValid` bit(1) DEFAULT NULL,
  `ModefiedTime` date DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `DiscountPercentage` bigint DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `StatusId` bigint DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  `PromoCode` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `ratedetails` (
  `ModefiedTime` date DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `StatusId` bigint DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `DistrictId` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  `PlanDatailsId` varchar(255) DEFAULT NULL,
  `Rate` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `paymentdetails` (
  `CusId` int DEFAULT NULL,
  `ModefiedTime` date DEFAULT NULL,
  `Amount` bigint DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `StatusId` bigint DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  `OrderId` varchar(255) DEFAULT NULL,
  `PaymentId` varchar(255) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `customerfeedback` (
  `ModefiedTime` date DEFAULT NULL,
  `StarRating` bit(1) DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `CustomerId` bigint DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `StatusId` bigint DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `FeedBack` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `deliverypersondetails` (
  `ModefiedTime` date DEFAULT NULL,
  `ZoneId` int DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `StatusId` bigint DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  `PhoneNumber` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `refreshtoken` (
  `IsTokenValid` bit(1) DEFAULT NULL,
  `ModefiedTime` date DEFAULT NULL,
  `CreatedTime` datetime(6) DEFAULT NULL,
  `ExpiryDate` datetime(6) DEFAULT NULL,
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `StatusId` bigint DEFAULT NULL,
  `CreatedBy` varchar(255) DEFAULT NULL,
  `ModefiedBy` varchar(255) DEFAULT NULL,
  `PhoneNumber` varchar(255) DEFAULT NULL,
  `ResfreshToken` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO lkpstatusid
(`CreatedTime`,
`ModefiedTime`,
`CreatedBy`,
`ModefiedBy`,
`Name`)
VALUES


    (NOW(), NULL, 'Admin', NULL, 'Active'),
    (NOW(), NULL, 'Admin', NULL, 'InActive'),
    (NOW(), NULL, 'Admin', NULL, 'Delete');

INSERT INTO lkpstate (
    modefiedtime,
    createdtime,
    statusid,
    createdby,
    modefiedby,
    state
)
VALUES
    (NULL, NOW(), 1, 'Admin', NULL, 'TamilNadu'),
    (NULL, NOW(), 1, 'Admin', NULL, 'Kerala');

INSERT INTO lkpavailabledistrict (
    modefiedtime,
    createdtime,
    statusid,
    createdby,
    district,
    modefiedby
) VALUES
    (NULL, NOW(), 1, 'Admin', 'Madurai', NULL),
    (NULL, NOW(), 1, 'Admin', 'Coimbatore', NULL),
    (NULL, NOW(), 1, 'Admin', 'TrivandrumS', NULL);
    
    INSERT INTO lkpgender (
    modefiedtime,
    createdtime,
    statusid,
    createdby,
    gendername,
    modefiedby
)
VALUES
    (NULL, NOW(), 1, 'Admin', 'Male', NULL),
    (NULL, NOW(), 1, 'Admin', 'Female', NULL);

INSERT INTO lkppackdetails (
    modefiedtime,
    createdtime,
    statusid,
    createdby,
    modefiedby,
    packagename
)
VALUES
    (NULL, NOW(), 1, 'Admin', NULL, 'KidPack'),
    (NULL, NOW(), 1, 'Admin', NULL, 'StandardPack'),
    (NULL, NOW(), 1, 'Admin', NULL, 'PremiumPack');

INSERT INTO lkpdeliverytimings (
    modefiedtime,
    createdtime,
    statusid,
    createdby,
    deliverytiming,
    modefiedby
) VALUES
    (NULL, NOW(), 1, 'Admin', '6-7', NULL),
    (NULL, NOW(), 1, 'Admin', '7-8', NULL),
    (NULL, NOW(), 1, 'Admin', '8-9.30', NULL),
    (NULL, NOW(), 1, 'Admin', 'Others', NULL);

INSERT INTO `staarbox`.`dailytagline`
(`modefiedtime`,
`createdtime`,
`statusid`,
`createdby`,
`modefiedby`,
`tagline`)
VALUES
(NULL,NOW(),1,'Admin',NULL,'When Life Fcuks StaarBox Sucks'),
(NULL,NOW(),2,'Admin',NULL,'https://youtu.be/MJyJqjqfQWE?si=_FGPTbwWfQMYnrwY');

INSERT INTO `staarbox`.`availablepincodes`
(`modefiedtime`,
`createdtime`,
`statusid`,
`createdby`,
`district`,
`modefiedby`,
`pincode`)
VALUES
(NULL,NOW(),1,'Admin','Madurai',NULL,'625017'),
(NULL,NOW(),1,'Admin','Madurai',NULL,'625020'),
(NULL,NOW(),1,'Admin','Madurai',NULL,'625014'),
(NULL,NOW(),1,'Admin','Madurai',NULL,'625018'),
(NULL,NOW(),1,'Admin','Madurai',NULL,'625104');

INSERT INTO ratedetails
    (modefiedtime, createdtime, statusid, createdby, districtid, modefiedby, plandatailsid, rate)
VALUES
    (NULL, NOW(), 1, 'Admin', 1, NULL, 1, 2099),
    (NULL, NOW(), 1, 'Admin', 2, NULL, 1, 2199),
    (NULL, NOW(), 1, 'Admin', 3, NULL, 1, 2099),
    (NULL, NOW(), 1, 'Admin', 1, NULL, 2, 2799),
    (NULL, NOW(), 1, 'Admin', 2, NULL, 2, 2899),
    (NULL, NOW(), 1, 'Admin', 3, NULL, 2, 2799),
    (NULL, NOW(), 1, 'Admin', 1, NULL, 3, 3599),
    (NULL, NOW(), 1, 'Admin', 2, NULL, 3, 3699),
    (NULL, NOW(), 1, 'Admin', 3, NULL, 3, 3599);
   
  INSERT INTO deliverypersondetails
(`ModefiedTime`,
`ZoneId`,
`CreatedTime`,
`StatusId`,
`CreatedBy`,
`ModefiedBy`,
`PhoneNumber`)
VALUES
(NULL,1,NOW(),1,'Admin',NULL,'9159894126'),
(NULL,1,NOW(),1,'Admin',NULL,'9043234100');
