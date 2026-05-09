// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChainInvoice {

    enum Status { Created, Funded, Delivered, Completed, Cancelled }

    struct Invoice {
        uint256 id;
        address payable freelancer;
        address payable client;
        uint256 amount;
        string description;
        Status status;
    }

    uint256 public invoiceCount;
    mapping(uint256 => Invoice) public invoices;

    event InvoiceCreated(uint256 id, address freelancer, address client, uint256 amount);
    event InvoiceFunded(uint256 id);
    event WorkDelivered(uint256 id);
    event PaymentReleased(uint256 id, uint256 amount);
    event InvoiceCancelled(uint256 id);

    function createInvoice(address payable _client, uint256 _amount, string memory _description) external {
        require(_client != address(0) && _client != msg.sender, "Invalid client");
        require(_amount > 0, "Amount must be greater than zero");

        invoiceCount++;
        invoices[invoiceCount] = Invoice(invoiceCount, payable(msg.sender), _client, _amount, _description, Status.Created);

        emit InvoiceCreated(invoiceCount, msg.sender, _client, _amount);
    }

    function fundInvoice(uint256 _id) external payable {
        Invoice storage inv = invoices[_id];
        require(msg.sender == inv.client, "Not the client");
        require(inv.status == Status.Created, "Wrong status");
        require(msg.value == inv.amount, "Wrong amount");

        inv.status = Status.Funded;
        emit InvoiceFunded(_id);
    }

    function markDelivered(uint256 _id) external {
        Invoice storage inv = invoices[_id];
        require(msg.sender == inv.freelancer, "Not the freelancer");
        require(inv.status == Status.Funded, "Wrong status");

        inv.status = Status.Delivered;
        emit WorkDelivered(_id);
    }

    function confirmAndRelease(uint256 _id) external {
        Invoice storage inv = invoices[_id];
        require(msg.sender == inv.client, "Not the client");
        require(inv.status == Status.Delivered, "Wrong status");

        (bool success, ) = inv.freelancer.call{value: inv.amount}("");
        require(success, "Transfer failed");

        inv.status = Status.Completed;
        emit PaymentReleased(_id, inv.amount);
}

    function cancelInvoice(uint256 _id) external {
        Invoice storage inv = invoices[_id];
        require(msg.sender == inv.freelancer || msg.sender == inv.client, "Not authorized");
        require(inv.status == Status.Created || inv.status == Status.Funded, "Cannot cancel");

        if (inv.status == Status.Funded) {
            (bool success, ) = inv.client.call{value: inv.amount}("");
            require(success, "Refund failed");
        }

        inv.status = Status.Cancelled;
        emit InvoiceCancelled(_id);
    }

    function getInvoice(uint256 _id) external view returns (Invoice memory) {
        return invoices[_id];
    }
}