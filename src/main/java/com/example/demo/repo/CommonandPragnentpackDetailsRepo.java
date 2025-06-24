package com.example.demo.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.CommonAndPragnentPackDetails;
@Repository
public interface CommonandPragnentpackDetailsRepo extends JpaRepository<CommonAndPragnentPackDetails, Long> {


	@Query(value = """
		    SELECT 
		        p.IsEggAdded AS isEggAdded,
		        E1.FruitAndNuts AS eggOrSeed, 
		        p.EggOrSeedWeight AS eggOrSeedWeight,
		        E1.protein AS protein, 
		        E1.fiber AS fiber,

		        f1.FruitAndNuts AS fruit1Name, p.Fruit1Weight AS fruit1Weight, f1.protein AS fruit1Protein, f1.fiber AS fruit1Fiber,
		        f2.FruitAndNuts AS fruit2Name, p.Fruit2Weight AS fruit2Weight, f2.protein AS fruit2Protein, f2.fiber AS fruit2Fiber,
		        f3.FruitAndNuts AS fruit3Name, p.Fruit3Weight AS fruit3Weight, f3.protein AS fruit3Protein, f3.fiber AS fruit3Fiber,
		        f4.FruitAndNuts AS fruit4Name, p.Fruit4Weight AS fruit4Weight, f4.protein AS fruit4Protein, f4.fiber AS fruit4Fiber,
		        f5.FruitAndNuts AS fruit5Name, p.Fruit5Weight AS fruit5Weight, f5.protein AS fruit5Protein, f5.fiber AS fruit5Fiber,

		        n1.FruitAndNuts AS nut1Name, p.Nut1Weight AS nut1Weight, n1.protein AS nut1Protein, n1.fiber AS nut1Fiber,
		        n2.FruitAndNuts AS nut2Name, p.Nut2Weight AS nut2Weight, n2.protein AS nut2Protein, n2.fiber AS nut2Fiber,
		        n3.FruitAndNuts AS nut3Name, p.Nut3Weight AS nut3Weight, n3.protein AS nut3Protein, n3.fiber AS nut3Fiber,
		        n4.FruitAndNuts AS nut4Name, p.Nut4Weight AS nut4Weight, n4.protein AS nut4Protein, n4.fiber AS nut4Fiber,
		        n5.FruitAndNuts AS nut5Name, p.Nut5Weight AS nut5Weight, n5.protein AS nut5Protein, n5.fiber AS nut5Fiber,

		        o1.FruitAndNuts AS optional1Name, p.Optional1Weight AS optional1Weight, p.Optional1IsFruit, o1.protein AS optional1Protein, o1.fiber AS optional1Fiber,
		        o2.FruitAndNuts AS optional2Name, p.Optional2Weight AS optional2Weight, p.Optional2IsFruit, o2.protein AS optional2Protein, o2.fiber AS optional2Fiber,
		        o3.FruitAndNuts AS optional3Name, p.Optional3Weight AS optional3Weight, p.Optional3IsFruit, o3.protein AS optional3Protein, o3.fiber AS optional3Fiber,
		        o4.FruitAndNuts AS optional4Name, p.Optional4Weight AS optional4Weight, p.Optional4IsFruit, o4.protein AS optional4Protein, o4.fiber AS optional4Fiber,
		        o5.FruitAndNuts AS optional5Name, p.Optional5Weight AS optional5Weight, p.Optional5IsFruit, o5.protein AS optional5Protein, o5.fiber AS optional5Fiber,
		        o6.FruitAndNuts AS optional6Name, p.Optional6Weight AS optional6Weight, p.Optional6IsFruit, o6.protein AS optional6Protein, o6.fiber AS optional6Fiber

		    FROM commonandPragnentpackDetails p
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

		    WHERE p.PackageTypeId = :packageTypeId 
		      AND p.WeekdayId = :weekdayId 
		      AND p.IsEggAdded = :isEggAdded 
		    """, nativeQuery = true)
		List<Object[]> getPackageItemView(
		    @Param("packageTypeId") int packageTypeId,
		    @Param("weekdayId") int weekdayId,
		    @Param("isEggAdded") Boolean isEggAdded
		);

	}

