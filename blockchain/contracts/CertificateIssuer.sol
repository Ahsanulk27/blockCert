// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract CertificateIssuer {
    struct Certificate {
        string recipientName;
        string courseName;
        string ipfsHash; // CID of the certificate file
        uint256 timestamp;
        bool isRevoked;
    }

    address public admin;
    uint256 public certCount = 0;

    mapping(uint256 => Certificate) public certificates;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    constructor() {
        admin = msg.sender; // deployer is admin
    }

    function issueCertificate(
        string memory _recipientName,
        string memory _courseName,
        string memory _ipfsHash
    ) public onlyAdmin {
        certificates[certCount] = Certificate(
            _recipientName,
            _courseName,
            _ipfsHash,
            block.timestamp,
            false
        );
        certCount++;
    }

    function revokeCertificate(uint256 _id) public onlyAdmin {
        require(_id < certCount, "Invalid cert ID");
        certificates[_id].isRevoked = true;
    }

    function getCertificate(uint256 _id) public view returns (Certificate memory) {
        require(_id < certCount, "Invalid cert ID");
        return certificates[_id];
    }
}
