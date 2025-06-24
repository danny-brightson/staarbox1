package com.example.demo.repo;

import java.sql.Date;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.CustomerDetails;

@Repository
public interface CustomerDetailsRepo extends JpaRepository<CustomerDetails, Long> {


	@Query(value = "select DistrictId from customerdetails where id = :customerId and StatusId=1", nativeQuery = true)
	int getDistrictId(int customerId);

	
	@Transactional
	@Modifying
	@Query(value = "UPDATE customerdetails SET IsEggPreferred =:eggPreferd, PackDetailsId = :packDetailsId WHERE id = :id AND StatusId = 1", nativeQuery = true)
	int updatePackDetails(boolean eggPreferd, int packDetailsId, Long id);


	    @Modifying
	    @Transactional
	    @Query("UPDATE CustomerDetails c SET " +
	           "c.addressLine1 = COALESCE(:addressLine1, c.addressLine1), " +
	           "c.addressLine2 = COALESCE(:addressLine2, c.addressLine2), " +
	           "c.addressType = COALESCE(:addressType, c.addressType), " +
	           "c.districtId = COALESCE(:districtId, c.districtId), " +
	           "c.stateId = COALESCE(:stateId, c.stateId), " +
	           "c.pinCode = COALESCE(:pinCode, c.pinCode), " +
	           "c.delivaryTimingId = COALESCE(:delivaryTimingId, c.delivaryTimingId) " +
	           "WHERE c.id = :customerId")
	    int updateCustomerDetails(
	            @Param("customerId") Long customerId,
	            @Param("addressLine1") String addressLine1,
	            @Param("addressLine2") String addressLine2,
	            @Param("addressType") String addressType,
	            @Param("districtId") Integer districtId,
	            @Param("stateId") Integer stateId,
	            @Param("pinCode") String pinCode,
	            @Param("delivaryTimingId") Integer delivaryTimingId
	    );
	    @Transactional
		@Modifying
		@Query(value = "UPDATE customerdetails SET IsPaymentSuccess =:isPaymentSuccess,NextRenewalDate =:nextrenewalDate,OrderId =:orderId WHERE id = :customerId AND StatusId = 1", nativeQuery = true)
	    int updatePaymentStatus(boolean isPaymentSuccess,
	             LocalDateTime nextrenewalDate,long customerId,String orderId);
	


}
