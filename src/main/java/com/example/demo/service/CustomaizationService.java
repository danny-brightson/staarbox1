package com.example.demo.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.IngredientDto;
import com.example.demo.dto.OptionalIngredientDto;
import com.example.demo.dto.PackageResponseDto;
import com.example.demo.entity.CustomerDetails;
import com.example.demo.repo.CommonandPragnentpackDetailsRepo;
import com.example.demo.repo.CustomerDetailsRepo;
import com.example.demo.repo.CustomizedpackagedetailsRepo;
import com.example.demo.repo.PackageTypeRepo;

@Service
public class CustomaizationService {
	@Autowired
	private CustomerDetailsRepo customerRepo;

	@Autowired
	private com.example.demo.repo.AllergicPackageDetailsRepo AllergicPackageDetailsRepo;

	@Autowired
	private CommonandPragnentpackDetailsRepo commonandPragnentpackDetailsRepo;

	@Autowired
	private CustomizedpackagedetailsRepo customizedpackagedetailsRepo;

	@Autowired
	private PackageTypeRepo PackageTypeRepo;

	public boolean isCommon(boolean isPregnant, boolean isAllergic, boolean isCustomized) {
		return !isPregnant && !isAllergic && !isCustomized;
	}
	public boolean doesCustomizedPackageExist(Long customerId, Long weekdayId, LocalDate date) {
	    Long count = customizedpackagedetailsRepo.countCustomizedEntries(customerId, weekdayId, date);
	    return count != null && count > 0;
	}

	public List<PackageResponseDto> getPackageByCustomerId(long customerId) {
		CustomerDetails customer = customerRepo.findById(customerId)
				.orElseThrow(() -> new RuntimeException("Customer not found"));
		LocalDate businessDate = LocalDate.now();
		DayOfWeek day = businessDate.getDayOfWeek();
		int weekday = day.getValue();

		boolean isCustomizedToday = doesCustomizedPackageExist(customerId,
				Long.valueOf(weekday), businessDate);

		boolean isCommon = isCommon(customer.isPragnent(), customer.isAlergic(), customer.isCustomized());

		int packageTypeId = PackageTypeRepo.getPackageTypeId(customer.isPragnent(), customer.isAlergic(),
				customer.isCustomized(), isCommon, customer.getPackDetailsId());

		List<Object[]> response = null;

		if (isCustomizedToday) {
			response = customizedpackagedetailsRepo.findDetailedPack(customerId, weekday, businessDate);
		} else if (Boolean.TRUE.equals(customer.isAlergic())) {
			response = AllergicPackageDetailsRepo.findDetailedPack(customerId, weekday);
		} else if (Boolean.TRUE.equals(customer.isPragnent())) {
			response = commonandPragnentpackDetailsRepo.getPackageItemView(packageTypeId, weekday,
					customer.isEggPreferd());
		}

		else {
			response = commonandPragnentpackDetailsRepo.getPackageItemView(packageTypeId, day.getValue(),
					customer.isEggPreferd());
		}
		;

		List<PackageResponseDto> responseList = new ArrayList<>();

		Map<String, Integer> indexMap = getIndexMap();

		for (Object[] row : response) {
			PackageResponseDto dto = new PackageResponseDto();

			dto.setEggAdded((Boolean) row[indexMap.get("isEggAdded")]);

			dto.setEggOrSeed(new IngredientDto((String) row[indexMap.get("eggOrSeed")],
					(String) row[indexMap.get("eggOrSeedWeight")], (String) row[indexMap.get("eggOrSeedProtein")],
					(String) row[indexMap.get("eggOrSeedFiber")]));

			// Fruits
			List<IngredientDto> fruits = new ArrayList<>();
			for (int i = 1; i <= 5; i++) {
				String name = (String) row[indexMap.getOrDefault("fruit" + i + "Name", -1)];
				if (name != null) {
					fruits.add(new IngredientDto(name, (String) row[indexMap.get("fruit" + i + "Weight")],
							(String) row[indexMap.get("fruit" + i + "Protein")],
							(String) row[indexMap.get("fruit" + i + "Fiber")]));
				}
			}
			dto.setFruits(fruits);

			// Nuts
			List<IngredientDto> nuts = new ArrayList<>();
			for (int i = 1; i <= 5; i++) {
				String name = (String) row[indexMap.getOrDefault("nut" + i + "Name", -1)];
				if (name != null) {
					nuts.add(new IngredientDto(name, (String) row[indexMap.get("nut" + i + "Weight")],
							(String) row[indexMap.get("nut" + i + "Protein")],
							(String) row[indexMap.get("nut" + i + "Fiber")]));
				}
			}
			dto.setNuts(nuts);
			// Optional
			List<OptionalIngredientDto> optionals = new ArrayList<>();
			for (int i = 1; i <= 6; i++) {
				String name = (String) row[indexMap.getOrDefault("optional" + i + "Name", -1)];
				if (name != null) {
					optionals.add(new OptionalIngredientDto(name, (String) row[indexMap.get("optional" + i + "Weight")],
							(Boolean) row[indexMap.get("Optional" + i + "IsFruit")],
							(String) row[indexMap.get("optional" + i + "Fiber")],
							(String) row[indexMap.get("optional" + i + "Protein")]));
				}
			}
			dto.setOptionals(optionals);

			responseList.add(dto);
		}
		return responseList;
	}

	private Map<String, Integer> getIndexMap() {
		Map<String, Integer> map = new HashMap<>();
		int i = 0;
		map.put("isEggAdded", i++);
		map.put("eggOrSeed", i++);
		map.put("eggOrSeedWeight", i++);
		map.put("eggOrSeedProtein", i++);
		map.put("eggOrSeedFiber", i++);

		for (int j = 1; j <= 5; j++) {
			map.put("fruit" + j + "Name", i++);
			map.put("fruit" + j + "Weight", i++);
			map.put("fruit" + j + "Protein", i++);
			map.put("fruit" + j + "Fiber", i++);
		}
		for (int j = 1; j <= 5; j++) {
			map.put("nut" + j + "Name", i++);
			map.put("nut" + j + "Weight", i++);
			map.put("nut" + j + "Protein", i++);
			map.put("nut" + j + "Fiber", i++);
		}
		for (int j = 1; j <= 6; j++) {
			map.put("optional" + j + "Name", i++);
			map.put("optional" + j + "Weight", i++);
			map.put("Optional" + j + "IsFruit", i++);
			map.put("optional" + j + "Protein", i++);
			map.put("optional" + j + "Fiber", i++);

		}
		return map;
	}

}
