pragma solidity ^0.5.16;
contract BlindBox{
    address payable seller;
    address payable buyer;
    uint paidprice;

    uint public no_of_boxs=0;
 //?   uint public no_of_history=0;
    uint public no_of_buy=0;

    struct Box{
        uint boxid;
        string boxname;
        uint realprice;
        bool stored;
        address payable seller;
        uint timestamp;
    }

    mapping(uint => Box) public Box_by_No;

    struct Buy{
        uint boxid;
        string boxname;
        address payable seller;
        address payable buyer;
        uint timestap;
        uint realprice;

    }
    mapping(uint => Buy) public Buy_by_No;

    modifier notseller(uint _index) {
        require(msg.sender != Box_by_No[_index].seller, "Only buyer can access this");
        _;
    }

    modifier OnlyWhileVacant(uint _index){
        require(Box_by_No[_index].stored == true, "Box is currently sold out.");
        _;
    }

    modifier enoughmoney(uint _index) {
        require(msg.value >= paidprice, "Not enough money in your wallet");
        _;
    }

    function addBox(string memory _boxname, uint _realprice) public {
        require(msg.sender != address(0));
        no_of_boxs ++;
        bool _stored = true;
        Box_by_No[no_of_boxs] = Box(no_of_boxs, _boxname, _realprice, _stored, msg.sender, 0);     
    }

    function buybox(uint _index, string memory _boxname) public payable notseller(_index) enoughmoney(_index) OnlyWhileVacant(_index) {
        require(msg.sender != address(0));
        address payable _seller = Box_by_No[_index].seller;
        _seller.transfer(paidprice);
        no_of_buy++;
        Box_by_No[_index].stored = false;
        Box_by_No[_index].timestamp = block.timestamp;
        Buy_by_No[no_of_buy]=Buy(_index, _boxname, _seller, msg.sender, Box_by_No[_index].timestamp, Box_by_No[_index].realprice);
       //RoomAgreement_by_No[no_of_agreement]=RoomAgreement(_index,no_of_agreement,Room_by_No[_index].roomname,Room_by_No[_index].roomaddress,Room_by_No[_index].rent_per_month,Room_by_No[_index].securityDeposit,365 days,block.timestamp,msg.sender,_landlord);
       //Rent_by_No[no_of_rent] = Rent(_index,no_of_agreement,Room_by_No[_index].roomname,Room_by_No[_index].roomaddress,Room_by_No[_index].rent_per_month,now,msg.sender,_landlord);
    }

}
