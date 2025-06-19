// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OpenZeppelin imports for Remix
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/security/Pausable.sol";

interface ILido {
    function submit(address _referral) external payable returns (uint256);
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
}

/**
 * @title SafeStakingWrapper
 * @dev A wrapper contract for Lido staking with fee collection and referral system
 * @notice This contract allows users to stake ETH through Lido while collecting platform fees
 * @notice FIXED VERSION: Properly transfers stETH to users after staking
 */
contract SafeStakingWrapper is Ownable, ReentrancyGuard, Pausable {
    
    // ==================== EVENTS ====================
    
    event Staked(
        address indexed user, 
        uint256 ethAmount, 
        uint256 feeAmount, 
        uint256 stakedAmount,
        uint256 stethReceived,
        address indexed referral
    );
    event FeeReceiverUpdated(address indexed oldReceiver, address indexed newReceiver);
    event FeeBpsUpdated(uint256 oldFeeBps, uint256 newFeeBps);
    event ReferralUpdated(address indexed oldReferral, address indexed newReferral);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    // ==================== NETWORK ADDRESSES ====================
    
    // Network-specific addresses (immutable for gas optimization)
    address public immutable LIDO;
    address public immutable STETH;
    
    // ==================== CONSTANTS ====================
    
    uint256 public constant MAX_FEE_BPS = 1000; // 10% maximum fee
    uint256 public constant BPS_DENOMINATOR = 10000;
    uint256 public constant MIN_STAKE_AMOUNT = 0.001 ether; // Minimum stake to avoid dust

    // ==================== STATE VARIABLES ====================
    
    address public feeReceiver;
    uint256 public feeBps; // Fee in basis points (e.g., 50 = 0.5%)
    address public referral;
    
    // Statistics
    uint256 public totalStaked;
    uint256 public totalFeesCollected;
    uint256 public totalStethDistributed;
    uint256 public totalUsers;
    
    mapping(address => uint256) public userStakedAmount;
    mapping(address => uint256) public userFeePaid;
    mapping(address => uint256) public userStethReceived;
    mapping(address => bool) public hasStaked; // Track unique users

    // ==================== CONSTRUCTOR ====================

    /**
     * @dev Constructor to initialize the contract
     * @param _lidoAddress Lido contract address (network-specific)
     * @param _stethAddress stETH token address (network-specific)
     * @param _feeReceiver Address to receive platform fees
     * @param _feeBps Fee percentage in basis points (50 = 0.5%)
     * @param _referral Referral address for Lido
     */
    constructor(
        address _lidoAddress,
        address _stethAddress,
        address _feeReceiver,
        uint256 _feeBps,
        address _referral
    ) {
        require(_lidoAddress != address(0), "Invalid Lido address");
        require(_stethAddress != address(0), "Invalid stETH address");
        require(_feeReceiver != address(0), "Invalid fee receiver");
        require(_feeBps <= MAX_FEE_BPS, "Fee too high");
        
        LIDO = _lidoAddress;
        STETH = _stethAddress;
        feeReceiver = _feeReceiver;
        feeBps = _feeBps;
        referral = _referral;
    }

    // ==================== MAIN STAKING FUNCTIONS ====================

    /**
     * @dev Stake ETH through Lido with fee collection
     * @notice Users send ETH, platform takes fee, remaining is staked via Lido, stETH sent to user
     */
    function stake() external payable nonReentrant whenNotPaused {
        require(msg.value >= MIN_STAKE_AMOUNT, "Amount too small");
        
        uint256 feeAmount = (msg.value * feeBps) / BPS_DENOMINATOR;
        uint256 stakeAmount = msg.value - feeAmount;
        
        require(stakeAmount > 0, "Stake amount must be positive");

        // Get stETH balance before staking
        uint256 stethBalanceBefore = IERC20(STETH).balanceOf(address(this));

        // Update statistics BEFORE external calls for security
        _updateUserStats(msg.sender, stakeAmount, feeAmount);

        // Transfer fee to fee receiver (only if fee > 0)
        if (feeAmount > 0) {
            _safeTransferETH(feeReceiver, feeAmount);
        }

        // Stake remaining ETH through Lido
        try ILido(LIDO).submit{value: stakeAmount}(referral) {
            
            // Get actual stETH received (handles edge cases better than return value)
            uint256 stethBalanceAfter = IERC20(STETH).balanceOf(address(this));
            uint256 stethReceived = stethBalanceAfter - stethBalanceBefore;
            
            require(stethReceived > 0, "No stETH received from Lido");
            
            // Transfer ALL received stETH to the user
            require(
                IERC20(STETH).transfer(msg.sender, stethReceived), 
                "stETH transfer to user failed"
            );
            
            // Update stETH statistics
            userStethReceived[msg.sender] += stethReceived;
            totalStethDistributed += stethReceived;
            
            emit Staked(msg.sender, msg.value, feeAmount, stakeAmount, stethReceived, referral);
            
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("Lido staking failed: ", reason)));
        } catch {
            revert("Lido staking failed: Unknown error");
        }
    }

    /**
     * @dev Stake ETH with custom referral address
     * @param _customReferral Custom referral address for this stake
     */
    function stakeWithReferral(address _customReferral) external payable nonReentrant whenNotPaused {
        require(msg.value >= MIN_STAKE_AMOUNT, "Amount too small");
        
        uint256 feeAmount = (msg.value * feeBps) / BPS_DENOMINATOR;
        uint256 stakeAmount = msg.value - feeAmount;
        
        require(stakeAmount > 0, "Stake amount must be positive");

        // Get stETH balance before staking
        uint256 stethBalanceBefore = IERC20(STETH).balanceOf(address(this));

        // Update statistics BEFORE external calls
        _updateUserStats(msg.sender, stakeAmount, feeAmount);

        // Transfer fee to fee receiver (only if fee > 0)
        if (feeAmount > 0) {
            _safeTransferETH(feeReceiver, feeAmount);
        }

        // Stake remaining ETH through Lido with custom referral
        try ILido(LIDO).submit{value: stakeAmount}(_customReferral) {
            
            // Get actual stETH received
            uint256 stethBalanceAfter = IERC20(STETH).balanceOf(address(this));
            uint256 stethReceived = stethBalanceAfter - stethBalanceBefore;
            
            require(stethReceived > 0, "No stETH received from Lido");
            
            // Transfer ALL received stETH to the user
            require(
                IERC20(STETH).transfer(msg.sender, stethReceived), 
                "stETH transfer to user failed"
            );
            
            // Update stETH statistics
            userStethReceived[msg.sender] += stethReceived;
            totalStethDistributed += stethReceived;
            
            emit Staked(msg.sender, msg.value, feeAmount, stakeAmount, stethReceived, _customReferral);
            
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("Lido staking failed: ", reason)));
        } catch {
            revert("Lido staking failed: Unknown error");
        }
    }

    // ==================== OWNER FUNCTIONS ====================

    /**
     * @dev Update fee receiver address (only owner)
     * @param _newFeeReceiver New address to receive fees
     */
    function setFeeReceiver(address _newFeeReceiver) external onlyOwner {
        require(_newFeeReceiver != address(0), "Invalid fee receiver");
        address oldReceiver = feeReceiver;
        feeReceiver = _newFeeReceiver;
        emit FeeReceiverUpdated(oldReceiver, _newFeeReceiver);
    }

    /**
     * @dev Update fee percentage (only owner)
     * @param _newFeeBps New fee in basis points
     */
    function setFeeBps(uint256 _newFeeBps) external onlyOwner {
        require(_newFeeBps <= MAX_FEE_BPS, "Fee too high");
        uint256 oldFeeBps = feeBps;
        feeBps = _newFeeBps;
        emit FeeBpsUpdated(oldFeeBps, _newFeeBps);
    }

    /**
     * @dev Update default referral address (only owner)
     * @param _newReferral New referral address
     */
    function setReferral(address _newReferral) external onlyOwner {
        address oldReferral = referral;
        referral = _newReferral;
        emit ReferralUpdated(oldReferral, _newReferral);
    }

    /**
     * @dev Pause the contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency function to withdraw any stuck tokens (only owner)
     * @param _token Token address (use address(0) for ETH)
     * @param _amount Amount to withdraw
     */
    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner {
        if (_token == address(0)) {
            // Withdraw ETH
            require(address(this).balance >= _amount, "Insufficient ETH balance");
            _safeTransferETH(owner(), _amount);
        } else {
            // Withdraw ERC20 token
            require(IERC20(_token).transfer(owner(), _amount), "Token transfer failed");
        }
        emit EmergencyWithdraw(_token, _amount);
    }

    // ==================== INTERNAL FUNCTIONS ====================

    /**
     * @dev Internal function to update user statistics
     * @param user User address
     * @param stakeAmount Amount being staked
     * @param feeAmount Fee being paid
     */
    function _updateUserStats(address user, uint256 stakeAmount, uint256 feeAmount) internal {
        // Track new users
        if (!hasStaked[user]) {
            hasStaked[user] = true;
            totalUsers++;
        }
        
        // Update user statistics
        userStakedAmount[user] += stakeAmount;
        userFeePaid[user] += feeAmount;
        
        // Update global statistics
        totalStaked += stakeAmount;
        totalFeesCollected += feeAmount;
    }

    /**
     * @dev Safe ETH transfer with proper error handling
     * @param to Recipient address
     * @param amount Amount to transfer
     */
    function _safeTransferETH(address to, uint256 amount) internal {
        (bool success, ) = to.call{value: amount}("");
        require(success, "ETH transfer failed");
    }

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @dev Calculate fee for a given ETH amount
     * @param _ethAmount ETH amount to calculate fee for
     * @return feeAmount The fee amount
     * @return stakeAmount The amount that will be staked after fee
     */
    function calculateFee(uint256 _ethAmount) external view returns (uint256 feeAmount, uint256 stakeAmount) {
        feeAmount = (_ethAmount * feeBps) / BPS_DENOMINATOR;
        stakeAmount = _ethAmount - feeAmount;
    }

    /**
     * @dev Get user staking statistics
     * @param _user User address
     * @return stakedAmount Total amount staked by user
     * @return feePaid Total fees paid by user
     * @return stethReceived Total stETH received by user
     */
    function getUserStats(address _user) external view returns (
        uint256 stakedAmount, 
        uint256 feePaid, 
        uint256 stethReceived
    ) {
        return (
            userStakedAmount[_user], 
            userFeePaid[_user], 
            userStethReceived[_user]
        );
    }

    /**
     * @dev Get comprehensive contract statistics
     * @return _totalStaked Total ETH staked through the contract
     * @return _totalFeesCollected Total fees collected
     * @return _totalStethDistributed Total stETH distributed to users
     * @return _totalUsers Total number of unique users
     * @return _currentFeeBps Current fee percentage
     * @return _feeReceiver Current fee receiver address
     */
    function getContractStats() external view returns (
        uint256 _totalStaked,
        uint256 _totalFeesCollected,
        uint256 _totalStethDistributed,
        uint256 _totalUsers,
        uint256 _currentFeeBps,
        address _feeReceiver
    ) {
        return (
            totalStaked, 
            totalFeesCollected, 
            totalStethDistributed,
            totalUsers,
            feeBps, 
            feeReceiver
        );
    }

    /**
     * @dev Get contract addresses for frontend integration
     */
    function getContractAddresses() external view returns (
        address lidoAddress, 
        address stethAddress
    ) {
        return (LIDO, STETH);
    }

    /**
     * @dev Check if contract has any stuck tokens (for monitoring)
     * @return ethBalance ETH stuck in contract
     * @return stethBalance stETH stuck in contract
     */
    function getStuckBalances() external view returns (
        uint256 ethBalance, 
        uint256 stethBalance
    ) {
        return (
            address(this).balance,
            IERC20(STETH).balanceOf(address(this))
        );
    }

    /**
     * @dev Get current staking rate (stETH per ETH)
     * Useful for frontend to show expected returns
     */
    function getCurrentStakingRate() external view returns (uint256 rate) {
        if (totalStaked == 0) return BPS_DENOMINATOR; // 1:1 ratio initially
        return (totalStethDistributed * BPS_DENOMINATOR) / totalStaked;
    }
}