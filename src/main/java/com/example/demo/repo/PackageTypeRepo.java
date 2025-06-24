package com.example.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.PackageType;

@Repository
public interface PackageTypeRepo extends JpaRepository<PackageType, Long>  {

	@Query(value = "select Id from package_types where PackageDetailsId=:packDetailsId and IsPregnant =:pragnent and IsAllergic=:alergic and IsCustomized=:customized and IsCommon =:isCommon", nativeQuery = true)
	int getPackageTypeId(boolean pragnent, boolean alergic, boolean customized, boolean isCommon, int packDetailsId);

}
