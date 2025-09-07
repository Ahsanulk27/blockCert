// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateIssuer is Ownable {
    struct Certificate {
        bytes32 certHash;    
        string ipfsCid;     
        uint256 issuedAt;
        bool revoked;
    }

    // sequential id for easy referencing
    uint256 public certCount;
    mapping(uint256 => Certificate) public certificates;
    mapping(bytes32 => uint256) public hashToCertId; // lookup to check existence

    event CertificateIssued(uint256 indexed certId, bytes32 indexed certHash, string ipfsCid, uint256 timestamp);
    event CertificateRevoked(uint256 indexed certId, bytes32 indexed certHash, uint256 timestamp);

    constructor(address initialOwner) Ownable(initialOwner) {}
    
    function issueCertificate(bytes32 _certHash, string calldata _ipfsCid) external onlyOwner returns (uint256) {
        require(_certHash != bytes32(0), "Invalid hash");
        // prevent duplicate
        require(hashToCertId[_certHash] == 0, "Certificate already issued");

        uint256 id = ++certCount;
        certificates[id] = Certificate({ certHash: _certHash, ipfsCid: _ipfsCid, issuedAt: block.timestamp, revoked: false });
        hashToCertId[_certHash] = id;

        emit CertificateIssued(id, _certHash, _ipfsCid, block.timestamp);
        return id;
    }

    function revokeCertificate(uint256 _certId) external onlyOwner {
        Certificate storage cert = certificates[_certId];
        require(cert.issuedAt != 0, "Not found");
        cert.revoked = true;
        emit CertificateRevoked(_certId, cert.certHash, block.timestamp);
    }

    function getCertificateById(uint256 _certId) external view returns (Certificate memory) {
        return certificates[_certId];
    }

    function getCertIdByHash(bytes32 _certHash) external view returns (uint256) {
        return hashToCertId[_certHash]; 
    }
}
