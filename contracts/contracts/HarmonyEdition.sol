//SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "./Management.sol";

contract HarmonyEdition is ERC1155Upgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");

    struct Edition {
        address albumNFTAddress;  // Changé de uint256 à address
        uint256 masterTokenId;
        uint256 maxSupply;
        uint256 currentSupply;
        uint256 price;
        address artist;
        string uri;  // Stockage de l'URI pour chaque édition
    }

    mapping(uint256 => Edition) public editions;
    uint256 private _nextEditionId;
    Management public management;

    // Events
    event EditionCreated(
        uint256 indexed editionId,
        address indexed albumAddress,
        uint256 masterTokenId,
        uint256 maxSupply,
        uint256 price,
        address indexed artist
    );

    event EditionPurchased(
        uint256 indexed editionId,
        address indexed buyer,
        uint256 price
    );

    function initialize(address managementAddress) public initializer {
        __ERC1155_init("");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        management = Management(managementAddress);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function createEdition(
        address albumAddress,
        uint256 masterTokenId,
        uint256 maxSupply,
        uint256 price,
        string memory _uri
    ) external returns (uint256) {
        require(management.isArtist(msg.sender), "Not an artist");
        require(maxSupply > 0, "Max supply must be > 0");

        uint256 editionId = _nextEditionId++;
        editions[editionId] = Edition(
            albumAddress,
            masterTokenId,
            maxSupply,
            0,
            price,
            msg.sender,
            _uri
        );

        emit EditionCreated(editionId, albumAddress, masterTokenId, maxSupply, price, msg.sender);
        return editionId;
    }

    // Les auditeurs achètent une édition
    function purchaseEdition(uint256 editionId) external payable {
        Edition storage edition = editions[editionId];
        require(edition.maxSupply > 0, "Edition does not exist");
        require(edition.currentSupply < edition.maxSupply, "Sold out");
        require(msg.value >= edition.price, "Insufficient payment");

        edition.currentSupply++;
        _mint(msg.sender, editionId, 1, "");

        // 90% artiste, 10% plateforme
        uint256 artistShare = (msg.value * 90) / 100;
        payable(edition.artist).transfer(artistShare);

        emit EditionPurchased(editionId, msg.sender, msg.value);
    }

    // Override de la fonction uri pour retourner l'URI spécifique à chaque édition
    function uri(uint256 editionId) public view override returns (string memory) {
        require(editions[editionId].maxSupply > 0, "Edition does not exist");
        return editions[editionId].uri;
    }

    // Fonction pour retirer les fonds de la plateforme (10%)
    function withdrawPlatformFees() external onlyRole(ADMIN_ROLE) {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(msg.sender).transfer(balance);
    }

    // Override requis car ERC1155 et AccessControl implémentent tous les deux supportsInterface
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Fonction requise par UUPS pour autoriser les upgrades
    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(ADMIN_ROLE)
        override
    {}
}