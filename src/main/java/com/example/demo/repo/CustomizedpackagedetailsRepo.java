package com.example.demo.repo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.dto.PackageResponseDto;
import com.example.demo.entity.CustomizedPackageDetails;

@Repository
public interface CustomizedpackagedetailsRepo extends JpaRepository<CustomizedPackageDetails, Long> {

	@Query(value = """
		    SELECT COUNT(*) 
		    FROM customizedPackagedetails 
		    WHERE CustomerId = :customerId AND WeekdaysId = :weekdayId AND DATE(CustomizedDate) = :date
		    """, nativeQuery = true)
		Long countCustomizedEntries(Long customerId, Long weekdayId, LocalDate date);


	
		    @Query(value = """
		        SELECT 
		            p.IsEggAdded, E1.FruitAndNuts, p.EggOrSeedWeight, E1.protein, E1.fiber,

		            f1.FruitAndNuts, p.Fruit1Weight, f1.protein, f1.fiber,
		            f2.FruitAndNuts, p.Fruit2Weight, f2.protein, f2.fiber,
		            f3.FruitAndNuts, p.Fruit3Weight, f3.protein, f3.fiber,
		            f4.FruitAndNuts, p.Fruit4Weight, f4.protein, f4.fiber,
		            f5.FruitAndNuts, p.Fruit5Weight, f5.protein, f5.fiber,

		            n1.FruitAndNuts, p.Nut1Weight, n1.protein, n1.fiber,
		            n2.FruitAndNuts, p.Nut2Weight, n2.protein, n2.fiber,
		            n3.FruitAndNuts, p.Nut3Weight, n3.protein, n3.fiber,
		            n4.FruitAndNuts, p.Nut4Weight, n4.protein, n4.fiber,
		            n5.FruitAndNuts, p.Nut5Weight, n5.protein, n5.fiber,

		            o1.FruitAndNuts, p.Optional1Weight, p.Optional1IsFruit, o1.protein, o1.fiber,
		            o2.FruitAndNuts, p.Optional2Weight, p.Optional2IsFruit, o2.protein, o2.fiber,
		            o3.FruitAndNuts, p.Optional3Weight, p.Optional3IsFruit, o3.protein, o3.fiber,
		            o4.FruitAndNuts, p.Optional4Weight, p.Optional4IsFruit, o4.protein, o4.fiber,
		            o5.FruitAndNuts, p.Optional5Weight, p.Optional5IsFruit, o5.protein, o5.fiber,
		            o6.FruitAndNuts, p.Optional6Weight, p.Optional6IsFruit, o6.protein, o6.fiber

		        FROM customizedpackagedetails p
		        LEFT JOIN lkpfruitandnuts E1 ON E1.Id = p.eggOrSeed
		        LEFT JOIN lkpfruitandnuts f1 ON f1.Id = p.Fruit1Id
		        LEFT JOIN lkpfruitandnuts f2 ON f2.Id = p.Fruit2Id
		        LEFT JOIN lkpfruitandnuts f3 ON f3.Id = p.Fruit3Id
		        LEFT JOIN lkpfruitandnuts f4 ON f4.Id = p.Fruit4Id
		        LEFT JOIN lkpfruitandnuts f5 ON f5.Id = p.Fruit5Id
		        LEFT JOIN lkpfruitandnuts n1 ON n1.Id = p.Nut1Id
		        LEFT JOIN lkpfruitandnuts n2 ON n2.Id = p.Nut2Id
		        LEFT JOIN lkpfruitandnuts n3 ON n3.Id = p.Nut3Id
		        LEFT JOIN lkpfruitandnuts n4 ON n4.Id = p.Nut4Id
		        LEFT JOIN lkpfruitandnuts n5 ON n5.Id = p.Nut5Id
		        LEFT JOIN lkpfruitandnuts o1 ON o1.Id = p.Optional1Id
		        LEFT JOIN lkpfruitandnuts o2 ON o2.Id = p.Optional2Id
		        LEFT JOIN lkpfruitandnuts o3 ON o3.Id = p.Optional3Id
		        LEFT JOIN lkpfruitandnuts o4 ON o4.Id = p.Optional4Id
		        LEFT JOIN lkpfruitandnuts o5 ON o5.Id = p.Optional5Id
		        LEFT JOIN lkpfruitandnuts o6 ON o6.Id = p.Optional6Id
		        WHERE p.CustomerId = :customerId AND p.WeekdaysId = :weekdaysId AND p.CustomizedDate = :customizedDate
		    """, nativeQuery = true)
		    List<Object[]> findDetailedPack(@Param("customerId") long customerId,
		                                    @Param("weekdaysId") int weekdaysId,
		                                    @Param("customizedDate") LocalDate customizedDate);
		

	

	

}
